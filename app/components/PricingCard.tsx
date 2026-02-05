import { Check } from "lucide-react";

interface CardInformations {
  name: string;
  id: string;
  href: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function PricingCard({
  subscription,
  id,
}: {
  subscription: CardInformations;
  id: number;
}) {
  return (
    <div
      key={subscription.id}
      className={classNames(
        subscription.featured
          ? "relative ring-primary/90 border-primary bg-primary/5 hover:ring-primary"
          : "bg-white/2.5 sm:mx-8 lg:mx-0 ring-white/10 hover:ring-white/25",
        subscription.featured
          ? ""
          : id === 0
            ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
            : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
        "rounded-3xl p-8 ring-1 sm:p-10 transition-all duration-300",
      )}
    >
      <h3
        id={subscription.id}
        className="text-primary text-base/7 font-semibold"
      >
        {subscription.name}
      </h3>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span className="text-white text-4xl font-semibold tracking-tight">
          {subscription.price}
        </span>
        {subscription.price === "Free" ? (
          ""
        ) : (
          <span className="text-muted text-base">/lifetime</span>
        )}
      </p>
      <p className="text-gray-300 mt-6 text-base/7">
        {subscription.description}
      </p>
      <ul
        role="list"
        className="text-gray-300 mt-8 space-y-3 text-sm/6 sm:mt-10"
      >
        {subscription.features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <Check
              aria-hidden="true"
              className="text-primary h-6 w-5 flex-none"
            />
            {feature}
          </li>
        ))}
      </ul>

      {!subscription.featured ? (
        <a
          href={subscription.href}
          aria-describedby={subscription.id}
          className="bg-foreground/10 text-white ring-1 ring-inset ring-white/5 hover:bg-foreground/20 focus-visible:outline-foreground/75 mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 transition-all ease-in-out duration-200"
        >
          Get started today
        </a>
      ) : (
        <div className="mt-8 sm:mt-10 block rounded-md px-3.5 py-2.5 text-center text-sm bg-primary/20 text-primary/60 cursor-not-allowed transition-all ease-in-out duration-200">
          Coming Soon
        </div>
      )}
    </div>
  );
}