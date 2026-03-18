import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  UUID_RE,
  verifyAndDecodeLicenceKey,
  findActiveSubscription,
  generateLicenceKey,
  getSubscriptionPeriodEnd,
  ensureDeviceBound,
} from "@/lib/licence";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  console.warn(
    "DEPRECATED: /activate-licence is deprecated. Use /verify-licence instead.",
  );

  try {
    const body = await request.json();
    const { licence_key: licenceKey, device_id: deviceId } = body;

    if (typeof licenceKey !== "string" || !licenceKey.includes(".")) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    if (typeof deviceId !== "string" || !UUID_RE.test(deviceId)) {
      return NextResponse.json(
        { error: "Invalid device_id" },
        { status: 400 },
      );
    }

    const result = verifyAndDecodeLicenceKey(licenceKey);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { customerId } = result;

    // Run subscription check and customer retrieve in parallel
    const [activeSub, customer] = await Promise.all([
      findActiveSubscription(stripe, customerId),
      stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>,
    ]);

    if (!activeSub) {
      return NextResponse.json(
        { error: "Subscription expired" },
        { status: 403 },
      );
    }

    const bindResult = await ensureDeviceBound(
      stripe,
      customerId,
      deviceId,
      customer,
    );
    if (bindResult) {
      return NextResponse.json(
        { error: bindResult.error },
        { status: bindResult.status },
      );
    }

    return NextResponse.json({
      licence_key: generateLicenceKey(
        customerId,
        getSubscriptionPeriodEnd(activeSub),
      ),
    });
  } catch (err) {
    console.error("Activate licence error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
