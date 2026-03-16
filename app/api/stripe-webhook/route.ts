import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateLicenceKey } from "@/lib/licence";

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
  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.paid"
  ) {
    let customerId: string;
    let periodEnd: number;
    let customerEmail: string | null = null;
    let checkoutSessionId: string | null = null;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || typeof session.customer !== "string") {
        // Guest checkout with no Stripe customer — nothing to licence
        return NextResponse.json({ received: true });
      }
      customerId = session.customer;
      customerEmail = session.customer_details?.email ?? null;
      checkoutSessionId = session.id;

      // Get the subscription to find the period end
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      periodEnd = subscription.current_period_end;
    } else {
      // invoice.paid (monthly renewal)
      const invoice = event.data.object as Stripe.Invoice;
      // Skip the first payment — checkout.session.completed already handled it
      if (invoice.billing_reason === "subscription_create") {
        return NextResponse.json({ received: true });
      }
      customerId = invoice.customer as string;
      customerEmail = invoice.customer_email;

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string,
      );
      periodEnd = subscription.current_period_end;
    }

    // Step 4: Generate the signed licence key
    const licenceKey = generateLicenceKey(customerId, periodEnd);

    // Step 5: Send the licence key by email and update session metadata in parallel
    const tasks: Promise<unknown>[] = [];

    if (customerEmail) {
      tasks.push(
        resend.emails
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
          .catch((err) => console.error("Failed to send licence email:", err)),
      );
    }

    // Store the licence key in the session metadata so the success page can display it
    if (checkoutSessionId) {
      tasks.push(
        stripe.checkout.sessions.update(checkoutSessionId, {
          metadata: { licence_key: licenceKey },
        }),
      );
    }

    await Promise.all(tasks);
  }

  // Always return 200 to Stripe (otherwise Stripe retries)
  return NextResponse.json({ received: true });
}
