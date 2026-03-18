import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  UUID_RE,
  verifyAndDecodeLicenceKey,
  findActiveSubscription,
  generateLicenceKey,
  getSubscriptionPeriodEnd,
} from "@/lib/licence";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const licenceKey = body.licence_key;
    const deviceId =
      typeof body.device_id === "string" && UUID_RE.test(body.device_id)
        ? body.device_id
        : null;

    if (typeof licenceKey !== "string" || !licenceKey.includes(".")) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    const result = verifyAndDecodeLicenceKey(licenceKey);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { customerId, payload } = result;

    // Reject keys that are more than 30 days past their expiry.
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now - 30 * 24 * 3600) {
      return NextResponse.json({ error: "Key expired" }, { status: 403 });
    }

    // Run independent Stripe calls in parallel when device check is needed
    if (deviceId) {
      const [customer, activeSub] = await Promise.all([
        stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>,
        findActiveSubscription(stripe, customerId),
      ]);

      const boundDeviceId = customer.metadata?.device_id;
      if (boundDeviceId && boundDeviceId !== deviceId) {
        return NextResponse.json(
          { error: "Device mismatch" },
          { status: 409 },
        );
      }

      if (!activeSub) {
        return NextResponse.json(
          { error: "Subscription expired" },
          { status: 403 },
        );
      }

      return NextResponse.json({
        licence_key: generateLicenceKey(
          customerId,
          getSubscriptionPeriodEnd(activeSub),
        ),
      });
    }

    // No device check — just verify subscription
    const activeSub = await findActiveSubscription(stripe, customerId);
    if (!activeSub) {
      return NextResponse.json(
        { error: "Subscription expired" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      licence_key: generateLicenceKey(
        customerId,
        getSubscriptionPeriodEnd(activeSub),
      ),
    });
  } catch (err) {
    console.error("Verify licence error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
