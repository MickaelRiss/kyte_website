import { Check } from "lucide-react";

interface CardInformations {
  name: string;
  id: string;
  href: string;
  price: string;
  yearlyPrice?: string;
  yearlyHref?: string;
  description: string;
  features: string[];
  featured: boolean;
}

export default function PricingCard({
  subscription,
  yearly,
}: {
  subscription: CardInformations;
  yearly: boolean;
}) {
  const price = yearly && subscription.yearlyPrice
    ? subscription.yearlyPrice
    : subscription.price;
  const href = yearly && subscription.yearlyHref
    ? subscription.yearlyHref
    : subscription.href;
  const isFree = subscription.price === "Free";

  return (
    <div
      className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-300 h-full flex flex-col ${
        subscription.featured
          ? "border border-primary/60 bg-primary/5 ring-1 ring-primary/30 shadow-lg shadow-primary/5"
          : "border border-white/10 bg-white/[0.03] hover:border-white/20"
      }`}
    >
      {subscription.featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-primary text-base font-semibold">
        {subscription.name}
      </h3>

      <p className="mt-5 flex items-baseline gap-x-2">
        <span className="text-white text-5xl font-bold tracking-tight">
          {price}
        </span>
        {!isFree && (
          <span className="text-muted text-base">
            /{yearly ? "year" : "mo"}
            {yearly && (
              <span className="ml-2 text-xs text-primary/80 font-medium">
                Save ~33%
              </span>
            )}
          </span>
        )}
      </p>

      <p className="text-gray-400 mt-5 text-sm leading-relaxed">
        {subscription.description}
      </p>

      <div className="mt-8 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <ul role="list" className="space-y-4 text-sm">
        {subscription.features.map((feature) => (
          <li key={feature} className="flex gap-x-3 items-start">
            <Check
              aria-hidden="true"
              className={`h-5 w-5 flex-none mt-0.5 ${
                subscription.featured ? "text-primary" : "text-gray-500"
              }`}
            />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 text-center">
        <a
          href={href}
          target={subscription.featured ? "_blank" : undefined}
          aria-describedby={subscription.id}
          className={`inline-block rounded-full px-8 py-2.5 text-sm font-medium transition-all duration-200 ${
            subscription.featured
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
              : "bg-white/10 text-white ring-1 ring-inset ring-white/10 hover:bg-white/15"
          }`}
        >
          {subscription.featured ? "Get Guardian" : "Get started today"}
        </a>
      </div>
    </div>
  );
}
