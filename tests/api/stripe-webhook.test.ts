import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock state — vi.hoisted runs before vi.mock factories and imports.
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  subscriptionsRetrieve: vi.fn(),
  sessionsUpdate: vi.fn(),
  customersUpdate: vi.fn(),
  subscriptionsUpdate: vi.fn(),
  emailsSend: vi.fn(),
  cryptoSign: vi.fn(),
  createPrivateKey: vi.fn().mockReturnValue("fake-private-key"),
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      webhooks: { constructEvent: mocks.constructEvent },
      subscriptions: {
        retrieve: mocks.subscriptionsRetrieve,
        update: mocks.subscriptionsUpdate,
      },
      checkout: { sessions: { update: mocks.sessionsUpdate } },
      customers: { update: mocks.customersUpdate },
    };
  }),
}));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mocks.emailsSend } };
  }),
}));

// Mock only sign and createPrivateKey — the route doesn't use any other crypto primitive.
vi.mock("crypto", async () => {
  const actual = await vi.importActual<typeof import("crypto")>("crypto");
  return {
    ...actual,
    sign: (...args: unknown[]) => mocks.cryptoSign(...args),
    createPrivateKey: (...args: unknown[]) => mocks.createPrivateKey(...args),
  };
});

// Import the route handler after all mocks are in place.
import { POST } from "../../app/api/stripe-webhook/route";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
const NOW = Math.floor(Date.now() / 1000);
const ACTIVE_SUBSCRIPTION = { items: { data: [{ current_period_end: NOW + 30 * 24 * 3600 }] } };

function makeRequest(body: string, stripeSignature?: string): Request {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (stripeSignature !== undefined) {
    headers["stripe-signature"] = stripeSignature;
  }
  return new Request("http://localhost/api/stripe-webhook", {
    method: "POST",
    body,
    headers,
  });
}

// A minimal checkout.session.completed event object.
function checkoutEvent(override: Record<string, unknown> = {}) {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        customer: "cus_abc",
        customer_details: { email: "user@example.com" },
        subscription: "sub_abc",
        ...override,
      },
    },
  };
}

// A minimal invoice.paid event object.
function invoiceEvent(billingReason: string, override: Record<string, unknown> = {}) {
  return {
    type: "invoice.paid",
    data: {
      object: {
        customer: "cus_abc",
        customer_email: "user@example.com",
        parent: { subscription_details: { subscription: "sub_abc" } },
        billing_reason: billingReason,
        ...override,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("POST /api/stripe-webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore sensible defaults after clearing.
    mocks.sessionsUpdate.mockResolvedValue({});
    mocks.customersUpdate.mockResolvedValue({});
    mocks.subscriptionsUpdate.mockResolvedValue({});
    mocks.emailsSend.mockResolvedValue({ id: "email_ok" });
    mocks.cryptoSign.mockReturnValue(Buffer.from("fakesig"));
    mocks.subscriptionsRetrieve.mockResolvedValue(ACTIVE_SUBSCRIPTION);
  });

  // --- Stripe signature guard ---

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(makeRequest("{}") as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing signature" });
  });

  it("returns 400 when Stripe signature verification fails", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("Bad webhook signature");
    });
    const res = await POST(makeRequest("{}", "bad_sig") as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid signature" });
  });

  // --- Unknown event type ---

  it("returns 200 and ignores unrecognised event types", async () => {
    mocks.constructEvent.mockReturnValue({
      type: "customer.created",
      data: { object: {} },
    });
    const res = await POST(makeRequest("{}", "sig") as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(mocks.emailsSend).not.toHaveBeenCalled();
  });

  // --- checkout.session.completed ---
  // This event only stores the licence key in session metadata (for the
  // success page). It does NOT send email — invoice.paid owns email delivery.

  describe("checkout.session.completed", () => {
    it("returns 200 early when session.customer is null", async () => {
      mocks.constructEvent.mockReturnValue(checkoutEvent({ customer: null }));
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true });
      expect(mocks.subscriptionsRetrieve).not.toHaveBeenCalled();
      expect(mocks.emailsSend).not.toHaveBeenCalled();
      expect(mocks.sessionsUpdate).not.toHaveBeenCalled();
    });

    it("returns 200 early when session.subscription is absent", async () => {
      mocks.constructEvent.mockReturnValue(checkoutEvent({ subscription: null }));
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.subscriptionsRetrieve).not.toHaveBeenCalled();
      expect(mocks.sessionsUpdate).not.toHaveBeenCalled();
    });

    it("retrieves subscription and updates session, customer, and subscription metadata (no email)", async () => {
      mocks.constructEvent.mockReturnValue(checkoutEvent());
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.subscriptionsRetrieve).toHaveBeenCalledWith("sub_abc");
      // No email — invoice.paid handles that
      expect(mocks.emailsSend).not.toHaveBeenCalled();
      // Session metadata updated with the licence key
      expect(mocks.sessionsUpdate).toHaveBeenCalledWith(
        "cs_test_123",
        expect.objectContaining({
          metadata: { licence_key: expect.stringContaining(".") },
        }),
      );
      // Customer metadata updated
      expect(mocks.customersUpdate).toHaveBeenCalledWith(
        "cus_abc",
        expect.objectContaining({
          metadata: { licence_key: expect.stringContaining(".") },
        }),
      );
      // Subscription metadata updated
      expect(mocks.subscriptionsUpdate).toHaveBeenCalledWith(
        "sub_abc",
        expect.objectContaining({
          metadata: { licence_key: expect.stringContaining(".") },
        }),
      );
    });
  });

  // --- invoice.paid ---
  // This event owns all licence email delivery (first payment + renewals).

  describe("invoice.paid", () => {
    it("generates a licence key and sends email for first payment (subscription_create)", async () => {
      mocks.constructEvent.mockReturnValue(
        invoiceEvent("subscription_create"),
      );
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.subscriptionsRetrieve).toHaveBeenCalledWith("sub_abc");
      expect(mocks.emailsSend).toHaveBeenCalledOnce();
      const emailArg = mocks.emailsSend.mock.calls[0][0];
      expect(emailArg.to).toBe("user@example.com");
    });

    it("generates a licence key and sends email for renewal (subscription_cycle)", async () => {
      mocks.constructEvent.mockReturnValue(invoiceEvent("subscription_cycle"));
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.subscriptionsRetrieve).toHaveBeenCalledWith("sub_abc");
      expect(mocks.emailsSend).toHaveBeenCalledOnce();
      const emailArg = mocks.emailsSend.mock.calls[0][0];
      expect(emailArg.to).toBe("user@example.com");
    });

    it("updates customer metadata with licence key", async () => {
      mocks.constructEvent.mockReturnValue(invoiceEvent("subscription_create"));
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.customersUpdate).toHaveBeenCalledWith(
        "cus_abc",
        expect.objectContaining({
          metadata: { licence_key: expect.stringContaining(".") },
        }),
      );
    });

    it("returns 200 without email when customer_email is null", async () => {
      mocks.constructEvent.mockReturnValue(
        invoiceEvent("subscription_cycle", { customer_email: null }),
      );
      const res = await POST(makeRequest("{}", "sig") as any);
      expect(res.status).toBe(200);
      expect(mocks.emailsSend).not.toHaveBeenCalled();
    });
  });
});
