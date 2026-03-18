import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock state
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => ({
  cryptoVerify: vi.fn(),
  cryptoSign: vi.fn(),
  subscriptionsList: vi.fn(),
  customersRetrieve: vi.fn(),
  customersUpdate: vi.fn(),
  createPrivateKey: vi.fn().mockReturnValue("fake-private-key"),
  createPublicKey: vi.fn().mockReturnValue("fake-public-key"),
}));

vi.mock("crypto", async () => {
  const actual = await vi.importActual<typeof import("crypto")>("crypto");
  return {
    ...actual,
    verify: (...args: unknown[]) => mocks.cryptoVerify(...args),
    sign: (...args: unknown[]) => mocks.cryptoSign(...args),
    createPrivateKey: (...args: unknown[]) => mocks.createPrivateKey(...args),
    createPublicKey: (...args: unknown[]) => mocks.createPublicKey(...args),
  };
});

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      subscriptions: { list: mocks.subscriptionsList },
      customers: {
        retrieve: mocks.customersRetrieve,
        update: mocks.customersUpdate,
      },
    };
  }),
}));

import { POST } from "../../app/api/activate-licence/route";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
const NOW = Math.floor(Date.now() / 1000);
const VALID_DEVICE_ID = "550e8400-e29b-41d4-a716-446655440000";
const OTHER_DEVICE_ID = "661f9511-f3ac-52e5-b827-557766551111";

function b64url(obj: object | Buffer): string {
  const buf = Buffer.isBuffer(obj) ? obj : Buffer.from(JSON.stringify(obj));
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

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

function makeRequest(
  licenceKey: unknown,
  deviceId: unknown,
): Request {
  return new Request("http://localhost/api/activate-licence", {
    method: "POST",
    body: JSON.stringify({ licence_key: licenceKey, device_id: deviceId }),
    headers: { "content-type": "application/json" },
  });
}

const ACTIVE_SUB = {
  items: { data: [{ current_period_end: NOW + 30 * 24 * 3600 }] },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("POST /api/activate-licence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.cryptoVerify.mockReturnValue(true);
    mocks.cryptoSign.mockReturnValue(Buffer.from("fakesig"));
    mocks.customersUpdate.mockResolvedValue({});
  });

  // --- Input validation ---

  it("returns 400 when licence_key is missing", async () => {
    const req = new Request("http://localhost/api/activate-licence", {
      method: "POST",
      body: JSON.stringify({ device_id: VALID_DEVICE_ID }),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it("returns 400 when device_id is missing", async () => {
    const key = makeLicenceKey("cus_123", NOW + 7 * 24 * 3600);
    const req = new Request("http://localhost/api/activate-licence", {
      method: "POST",
      body: JSON.stringify({ licence_key: key }),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid device_id" });
  });

  it("returns 400 when device_id is not a valid UUID", async () => {
    const key = makeLicenceKey("cus_123", NOW + 7 * 24 * 3600);
    const res = await POST(makeRequest(key, "not-a-uuid") as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Invalid device_id" });
  });

  // --- Signature verification ---

  it("returns 403 when signature is invalid", async () => {
    mocks.cryptoVerify.mockReturnValue(false);
    const key = makeLicenceKey("cus_123", NOW + 7 * 24 * 3600);
    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(403);
    expect(mocks.subscriptionsList).not.toHaveBeenCalled();
  });

  // --- Subscription checks ---

  it("returns 403 when subscription is expired", async () => {
    const key = makeLicenceKey("cus_expired", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          { items: { data: [{ current_period_end: NOW - 5 * 24 * 3600 }] } },
        ],
      });
    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "Subscription expired" });
  });

  // --- Device binding ---

  it("binds device and returns 200 when no device is bound yet", async () => {
    const key = makeLicenceKey("cus_new", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList.mockResolvedValue({ data: [ACTIVE_SUB] });
    mocks.customersRetrieve.mockResolvedValue({ metadata: {} });

    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.licence_key).toBe("string");

    // Should have written the device_id to Stripe
    expect(mocks.customersUpdate).toHaveBeenCalledWith("cus_new", {
      metadata: { device_id: VALID_DEVICE_ID },
    });
  });

  it("returns 200 when same device re-activates", async () => {
    const key = makeLicenceKey("cus_same", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList.mockResolvedValue({ data: [ACTIVE_SUB] });
    mocks.customersRetrieve.mockResolvedValue({
      metadata: { device_id: VALID_DEVICE_ID },
    });

    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(200);

    // Should NOT update Stripe (already bound to same device)
    expect(mocks.customersUpdate).not.toHaveBeenCalled();
  });

  it("returns 409 when key is already bound to a different device", async () => {
    const key = makeLicenceKey("cus_bound", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList.mockResolvedValue({ data: [ACTIVE_SUB] });
    mocks.customersRetrieve.mockResolvedValue({
      metadata: { device_id: OTHER_DEVICE_ID },
    });

    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      error: "Device mismatch",
    });

    // Must not overwrite existing binding
    expect(mocks.customersUpdate).not.toHaveBeenCalled();
  });

  it("works with cancelled-but-still-in-period subscription", async () => {
    const key = makeLicenceKey("cus_cancelling", NOW + 7 * 24 * 3600);
    mocks.subscriptionsList
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          { items: { data: [{ current_period_end: NOW + 5 * 24 * 3600 }] } },
        ],
      });
    mocks.customersRetrieve.mockResolvedValue({ metadata: {} });

    const res = await POST(makeRequest(key, VALID_DEVICE_ID) as any);
    expect(res.status).toBe(200);
    expect(mocks.customersUpdate).toHaveBeenCalled();
  });
});
