import Link from "next/link";
import Stripe from "stripe";
import { generateLicenceKey, getSubscriptionPeriodEnd } from "@/lib/licence";
import LicenceDisplay from "./LicenceDisplay";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getLicenceKey(sessionId: string): Promise<string | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);

    if (!customerId) return null;

    const subscription = session.subscription as Stripe.Subscription | null;
    const periodEnd = getSubscriptionPeriodEnd(subscription) || null;

    if (!periodEnd) return null;

    return generateLicenceKey(customerId, periodEnd);
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const licenceKey = session_id ? await getLicenceKey(session_id) : null;

  if (!licenceKey) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 min-h-below-navbar">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-5xl mb-6">✉️</p>
          <h1 className="text-3xl font-bold text-white mb-4">
            Check your email
          </h1>
          <p className="text-gray-400 text-base/7 mb-4">
            Your Guardian licence key has been sent to your email address. If
            you don&apos;t see it within a few minutes, check your spam folder.
          </p>
          <ol className="text-gray-400 text-sm/7 space-y-1 list-decimal list-inside mb-8">
            <li>Open Kyte on your device</li>
            <li>Tap on "I have a key" button</li>
            <li>Paste your licence key and tap Activate</li>
          </ol>
          <Link
            href="/"
            className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-below-navbar">
      <div className="max-w-2xl mx-auto text-center w-full">
        <p className="text-5xl mb-6 text-primary">✓</p>
        <h1 className="text-3xl font-bold text-white mb-4">
          Your Guardian licence is ready
        </h1>
        <p className="text-gray-400 text-base/7 mb-10">
          Copy the key below and paste it into Kyte to activate your Guardian
          features.
        </p>

        <LicenceDisplay licenceKey={licenceKey} />

        <div className="mt-10 text-left bg-white/5 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-3">Next steps</h2>
          <ol className="text-gray-400 text-sm/7 space-y-1 list-decimal list-inside">
            <li>Open Kyte on your device</li>
            <li>Tap on "I have a key" button</li>
            <li>Paste your licence key and tap Activate</li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
