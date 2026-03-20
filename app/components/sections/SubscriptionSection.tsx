"use client";

import { useState } from "react";
import PricingCard from "../PricingCard";
import FadeInView from "../FadeInView";

const subscriptions = [
  {
    name: "Community",
    id: "tier-community",
    href: "#download",
    price: "Free",
    description: "Perfect for individuals securing personal portfolios.",
    features: [
      "No account required",
      "Standard 2-of-3 Splitting",
      "Local-only Processing",
      "1 seed encryption",
      "Basic QR Generation",
      "Unlimited seed decryptions",
    ],
    featured: false,
  },
  {
    name: "Guardian",
    id: "tier-pro",
    href: "https://buy.stripe.com/test_bJe14n7KP8PW8XadO92cg01?locale=en",
    price: "$4.99",
    yearlyPrice: "$39.99",
    yearlyHref: "https://buy.stripe.com/test_dRm3cv8OTaY4ddqeSd2cg02",
    description: "For power users and enterprise security needs.",
    features: [
      "No account required",
      "10-seed encryption",
      "Everything in Community",
      "Custom M-of-N Configs (up to 10)",
      "AES-256-GCM encryption with passphrase",
      "Telegram alerts on decryption or attempt with IP location",
    ],
    featured: true,
  },
];

export default function SubscriptionPlan() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="relative mt-10 isolate lg:px-0 py-1 px-6" id="plans">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-120 bg-linear-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-10rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-primary/30 to-background opacity-40 sm:left-[calc(50%+60rem)] sm:w-288.75"
        />
      </div>

      <div className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 md:px-0">
        <div className="mb-16">
          <FadeInView delay={0.1}>
            <h2 className="text-4xl font-bold mb-4">
              Institutional Strength. Effortless Control.
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="text-lg text-gray-400">
              The ultimate safeguard for your digital legacy. No account needed,
              just download and start protecting your seeds.
            </p>
          </FadeInView>
        </div>

        <FadeInView delay={0.3}>
          <div className="flex justify-center mb-12">
            <div className="relative flex items-center bg-white/5 rounded-full p-1 ring-1 ring-white/10">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-primary shadow-md transition-all duration-300 ease-in-out"
                style={{
                  width: "calc(50% - 4px)",
                  left: yearly ? "calc(50% + 2px)" : "4px",
                }}
              />
              <button
                onClick={() => setYearly(false)}
                className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 ${
                  !yearly
                    ? "text-primary-foreground"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200 ${
                  yearly
                    ? "text-primary-foreground"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </FadeInView>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {subscriptions.map((subscription) => (
            <FadeInView key={subscription.id} delay={0.1}>
              <PricingCard subscription={subscription} yearly={yearly} />
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
