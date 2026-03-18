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

      // Store in session metadata so the success page can display the key,
      // and persist on customer + subscription for dashboard visibility.
      await Promise.all([
        stripe.checkout.sessions.update(session.id, {
          metadata: { licence_key: licenceKey },
        }),
        stripe.customers.update(session.customer as string, {
          metadata: { licence_key: licenceKey },
        }),
        stripe.subscriptions.update(session.subscription as string, {
          metadata: { licence_key: licenceKey },
        }),
      ]);
    } else if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const customerEmail = invoice.customer_email;
      const subscriptionId = invoice.parent?.subscription_details
        ?.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = getSubscriptionPeriodEnd(subscription);
      const licenceKey = generateLicenceKey(customerId, periodEnd);

      if (customerEmail) {
        await resend.emails
          .send({
            from: "Kyte <noreply@kytesec.com>",
            to: customerEmail,
            subject: "Your Kyte Guardian Licence Key",
            html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0c0c0e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0c0c0e;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#141316;border-radius:16px;border:1px solid #26262e;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #26262e;">
          <span style="font-size:28px;font-weight:700;color:#efefef;letter-spacing:-0.5px;">Guardian Plan</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#efefef;">Your licence key</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#a0a0a9;line-height:1.6;">Your licence refreshes automatically each time you open Kyte. Use the key below only if you need to activate manually.</p>

          <!-- Licence key box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#0c0c0e;border:1px solid #26262e;border-radius:12px;padding:20px;text-align:center;">
              <p style="margin:0 0 8px;font-size:10px;font-weight:600;color:#6b6b73;text-transform:uppercase;letter-spacing:1.5px;">Double click to select all</p>
              <p style="margin:0;font-family:'SF Mono',Monaco,Menlo,'Courier New',monospace;font-size:13px;color:#c9a849;word-break:break-all;line-height:1.7;user-select:all;-webkit-user-select:all;-moz-user-select:all;">${licenceKey}</p>
            </td></tr>
          </table>

          <!-- Divider -->
          <div style="border-top:1px solid #26262e;margin:28px 0;"></div>

          <p style="margin:0;font-size:13px;color:#6b6b73;line-height:1.6;">This key is linked to your subscription and refreshes automatically each time you open Kyte. As long as your subscription is active, Guardian stays unlocked, no action needed on your end.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #26262e;text-align:center;">
          <a href="https://kytesec.com" style="font-size:12px;color:#c9a849;text-decoration:none;">kytesec.com</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
            `,
          })
          .catch((err) => console.error("Failed to send licence email:", err));
      }

      await stripe.customers.update(customerId, {
        metadata: { licence_key: licenceKey },
      });
    }
  } catch (err) {
    console.error("Stripe webhook business logic error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  // Always return 200 to Stripe (otherwise Stripe retries)
  return NextResponse.json({ received: true });
}
