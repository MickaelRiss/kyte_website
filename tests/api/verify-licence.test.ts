import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock state
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => ({
  // Controls whether the Ed25519 verifier accepts the incoming key.
  cryptoVerify: vi.fn(),
  // Returns a fake signature buffer so generateLicenceKey produces a valid key.
  cryptoSign: vi.fn(),
  // Stripe subscriptions.list mock.
  subscriptionsList: vi.fn(),
}));

// Mock only createVerify and createSign — everything else from crypto is real.
vi.mock("crypto", async () => {
  const actual = await vi.importActual<typeof import("crypto")>("crypto");
  return {
    ...actual,
    createVerify: () => ({ update: vi.fn(), verify: mocks.cryptoVerify }),
    createSign: () => ({ update: vi.fn(), sign: mocks.cryptoSign }),
  };
});

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function () {
    return { subscriptions: { list: mocks.subscriptionsList } };
  }),
}));

import { POST } from "../../app/api/verify-licence/route";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
const NOW = Math.floor(Date.now() / 1000);

/** Encode a JSON object as base64url (no padding). */
function b64url(obj: object | Buffer): string {
  const buf = Buffer.isBuffer(obj) ? obj : Buffer.from(JSON.stringify(obj));
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Build a syntactically correct licence key (3 dot-separated base64url parts).
 * The signature part is a placeholder — whether it "passes" is controlled by
 * the `mocks.cryptoVerify` mock, not the actual bytes.
 */
function makeLicenceKey(customerId: string, exp: number): string {
  const header = b64url({ alg: "EdDSA", typ: "licence" });
  const payload = b64url({
    sub: customerId,
    exp,
    features: ["passphrase"],
    fragment_limit: 10,
    iat: NOW,
  });
  const sig = b64url(Buffer.from("fakesig"));
  return `${header}.${payload}.${sig}`;
}

function makeRequest(licenceKey: unknown): Request {
  return new Request("http://localhost/api/verify-licence", {
    method: "POST",
    body: JSON.stringify({ licence_key: licenceKey }),
    headers: { "content-type": "application/json" },
  });
}

// A future-dated active subscription returned by Stripe.
const ACTIVE_SUB = { items: { data: [{ current_period_end: NOW + 30 * 24 * 3600 }] } };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("POST /api/verify-licence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: valid signature, real-looking sign output.
    mocks.cryptoVerify.mockReturnValue(true);
    mocks.cryptoSign.mockReturnValue(Buffer.from("fakesig"));
  });

  // --- Input validation ---

  it("returns 400 when licence_key is missing from body", async () => {
    const req = new Request("http://localhost/api/verify-licence", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("returns 400 when key does not have exactly 3 dot-separated parts", async () => {
    const res = await POST(makeRequest("foo.bar") as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid key format" });
  });

  // --- Signature verification ---

  it("returns 403 when Ed25519 signature is invalid", async () => {
    mocks.cryptoVerify.mockReturnValue(false);
    const key = makeLicenceKey("cus_123", NOW + 7 * 24 * 3600);
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "Invalid signature" });
    // Stripe must not be called when signature is bad.
    expect(mocks.subscriptionsList).not.toHaveBeenCalled();
  });

  // --- 30-day grace period check (Fix #5) ---

  it("returns 403 without calling Stripe when key is more than 30 days past expiry", async () => {
    const expiredExp = NOW - 31 * 24 * 3600; // 31 days ago
    const key = makeLicenceKey("cus_123", expiredExp);
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "Key expired" });
    expect(mocks.subscriptionsList).not.toHaveBeenCalled();
  });

  it("proceeds to Stripe when key is within the 30-day grace period (29 days past exp)", async () => {
    const exp = NOW - 29 * 24 * 3600; // 29 days ago — still within grace
    const key = makeLicenceKey("cus_123", exp);
    mocks.subscriptionsList.mockResolvedValue({ data: [ACTIVE_SUB] });
    const res = await POST(makeRequest(key) as any);
    // Grace period check passes → Stripe is queried.
    expect(mocks.subscriptionsList).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  // --- Stripe subscription checks ---

  it("returns a fresh licence key when subscription is active", async () => {
    const key = makeLicenceKey("cus_active", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList.mockResolvedValue({ data: [ACTIVE_SUB] });
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.licence_key).toBe("string");
    // Fresh key must have the same 3-part structure.
    expect(body.licence_key.split(".").length).toBe(3);
  });

  it("returns a fresh key when subscription is cancelled but still within paid period", async () => {
    const key = makeLicenceKey("cus_cancelling", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList
      // First call: status=active → empty (subscription is canceled)
      .mockResolvedValueOnce({ data: [] })
      // Second call: no status filter → returns the cancelled-but-in-period sub
      .mockResolvedValueOnce({
        data: [{ items: { data: [{ current_period_end: NOW + 5 * 24 * 3600 }] } }],
      });
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.licence_key).toBe("string");
  });

  it("returns 403 when subscription period has truly ended", async () => {
    const key = makeLicenceKey("cus_expired", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList
      .mockResolvedValueOnce({ data: [] }) // no active sub
      .mockResolvedValueOnce({
        data: [{ items: { data: [{ current_period_end: NOW - 5 * 24 * 3600 }] } }], // past period end
      });
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "Subscription expired" });
  });

  it("returns 403 when customer has no subscriptions at all", async () => {
    const key = makeLicenceKey("cus_nosub", NOW + 7 * 24 * 3600);
    // Both calls return empty: no active sub, no historical sub.
    mocks.subscriptionsList.mockResolvedValue({ data: [] });
    const res = await POST(makeRequest(key) as any);
    expect(res.status).toBe(403);
  });
});
