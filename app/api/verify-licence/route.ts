import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verify, createPublicKey } from "crypto";
import { base64urlDecode, base64urlEncode, generateLicenceKey, getSubscriptionPeriodEnd } from "@/lib/licence";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAysSG93pDLjmsnY88yDT/71WqBHA8jr2vqdiYh2T/YlA=
-----END PUBLIC KEY-----`);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const licenceKey = body.licence_key;

    if (typeof licenceKey !== "string" || !licenceKey.includes(".")) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    // Step 1: Decode the incoming key to extract the customer ID
    const parts = licenceKey.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid key format" },
        { status: 400 },
      );
    }

    // Verify the signature first (make sure this key was issued by us)
    const [headerB64, payloadB64, signatureB64] = parts;
    if (!verify(null, Buffer.from(`${headerB64}.${payloadB64}`), PUBLIC_KEY, base64urlDecode(signatureB64))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const payload = JSON.parse(base64urlDecode(payloadB64).toString("utf-8"));

    // Reject keys that are more than 30 days past their expiry.
    // Valid users always get a fresh key on each app launch via background refresh,
    // so a very old key reaching this endpoint is suspicious (e.g. a leaked key).
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now - 30 * 24 * 3600) {
      return NextResponse.json({ error: "Key expired" }, { status: 403 });
    }

    const customerId = payload.sub;

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Step 2: Check with Stripe if this customer still has an active subscription
    // Note: subscriptions with cancel_at_period_end=true still have status "active"
    // until the period ends, so this single query covers both the normal and
    // canceling-but-still-paid cases.
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const activeSub = subscriptions.data[0];

    if (!activeSub) {
      // No active subscription — check if there's one that's still in its paid period
      const allSubs = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      const sub = allSubs.data[0];
      const subPeriodEnd = getSubscriptionPeriodEnd(sub);
      if (sub && subPeriodEnd > now) {
        // Still in paid period even though cancelled
        return NextResponse.json({
          licence_key: generateLicenceKey(customerId, subPeriodEnd),
        });
      }

      // Truly expired
      return NextResponse.json(
        { error: "Subscription expired" },
        { status: 403 },
      );
    }

    // Step 3: Generate a fresh key with the current period end
    return NextResponse.json({
      licence_key: generateLicenceKey(customerId, getSubscriptionPeriodEnd(activeSub)),
    });
  } catch (err) {
    console.error("Verify licence error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
