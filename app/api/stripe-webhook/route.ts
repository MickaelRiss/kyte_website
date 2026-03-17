import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateLicenceKey, getSubscriptionPeriodEnd } from "@/lib/licence";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  // Step 1: Read the raw body (Stripe needs the raw body to verify the signature)
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Step 2: Verify this request really comes from Stripe
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Step 3: Handle the events we care about
  //
  // Email responsibility is split to avoid duplicate emails:
  //   - checkout.session.completed: stores the key in session metadata (for the
  //     success page) but does NOT send email.
  //   - invoice.paid: sends the licence email (both first payment and renewals).
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (
        !session.customer ||
        typeof session.customer !== "string" ||
        !session.subscription
      ) {
        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      const licenceKey = generateLicenceKey(
        session.customer,
        getSubscriptionPeriodEnd(subscription),
      );

      // Store in session metadata so the success page can display the key
      await stripe.checkout.sessions.update(session.id, {
        metadata: { licence_key: licenceKey },
      });
    } else if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const customerEmail = invoice.customer_email;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription as string;
      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = getSubscriptionPeriodEnd(subscription);
      const licenceKey = generateLicenceKey(customerId, periodEnd);

      if (customerEmail) {
        await resend.emails
          .send({
            from: "Kyte <noreply@kytesec.com>",
            to: customerEmail,
            subject: "Your Kyte Guardian Licence Key",
            html: `
              <h2>Welcome to Kyte Guardian!</h2>
              <p>Here is your licence key. Copy and paste it into the Kyte app to activate Guardian.</p>
              <div style="background: #1a1a1b; color: #c9a849; padding: 16px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 16px 0;">
                ${licenceKey}
              </div>
              <p>This key is linked to your subscription. It will refresh automatically each time you open Kyte.</p>
              <p>— The Kyte Team</p>
            `,
          })
          .catch((err) => console.error("Failed to send licence email:", err));
      }
    }
  } catch (err) {
    console.error("Stripe webhook business logic error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  // Always return 200 to Stripe (otherwise Stripe retries)
  return NextResponse.json({ received: true });
}
