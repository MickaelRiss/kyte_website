import PricingCard from "./PricingCard";
import FadeInView from "./FadeInView";

const subscriptions = [
  {
    name: "Community",
    id: "tier-community",
    href: "#",
    price: "Free",
    description: "Perfect for individuals securing personal portfolios.",
    features: [
      "Standard 2-of-3 Splitting",
      "Local-only Processing",
      "Basic QR Generation",
      "Unlimited seed encryptions",
    ],
    featured: false,
  },
  {
    name: "Pro License",
    id: "tier-pro",
    href: "#",
    price: "$49",
    description: "For power users and enterprise security needs.",
    features: [
      "Everything from Community",
      "Custom M-of-N Configs (up to 10)",
      "Double Encryption with passphrase",
      "Multisig Security",
      "Priority Support",
    ],
    featured: true,
  },
];

export default function SubscriptionPlan() {
  return (
    <div className="relative mt-40 px-6 lg:px-0 isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-primary/30 to-background opacity-40 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>

      <div className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 md:px-0">
        <div className="mb-16">
          <FadeInView delay={0.1}>
            <h2 className="text-4xl font-bold mb-4">
              Enterprise Security. Consumer Simplicity.
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="text-lg text-gray-400">
              Everything you need to secure your crypto forever
            </p>
          </FadeInView>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {subscriptions.map((subscription, id) => (
            <div key={id}>
              <FadeInView delay={0.1}>
                <PricingCard subscription={subscription} id={id} />
              </FadeInView>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
