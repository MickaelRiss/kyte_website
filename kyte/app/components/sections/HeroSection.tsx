import Image from "next/image";
import FadeInView from "../FadeInView";
import WaitlistModal from "../WaitlistModal";
import ActionButton from "../ActionButton";

export default function HeroSection() {
  return (
    <section className="relative isolate md:pt-50 lg:px-0 pt-24 px-6">
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

      <div className="mx-auto max-w-5xl flex flex-col items-center justify-center">
        <FadeInView delay={0.1}>
          <div className="border rounded-full ring-1 ring-primary/90 border-primary bg-primary/40 px-4 py-1 text-sm whitespace-nowrap text-white inline-flex gap-3 items-center hover:ring-primary transition-all">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>v1.0 is live now</span>
          </div>
        </FadeInView>
        <div className="text-center mt-8">
          <h1 className="space-y-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl flex flex-col">
            <FadeInView delay={0.1}>
              <span>Secure Your Wallet.</span>
            </FadeInView>
            <FadeInView delay={0.2}>
              <span>Never Loose Access Again.</span>
            </FadeInView>
          </h1>
          <FadeInView delay={0.3}>
            <p className="mt-8 text-lg text-pretty text-gray-400 sm:text-xl/8">
              Turn your seed phrase into distributed shards using Shamir&apos;s
              Secret Sharing. Eliminate single points of failure with
              developer-grade cryptography tools.
            </p>
          </FadeInView>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <FadeInView delay={0.4}>
              <WaitlistModal />
            </FadeInView>
            <FadeInView delay={0.5}>
              <ActionButton />
            </FadeInView>
          </div>
        </div>
        <FadeInView delay={0.6}>
          <Image
            src="/kyte_homepage.png"
            alt="Kyte Homepage"
            width="800"
            height="800"
            className="mt-20 rounded-md drop-shadow-lg"
          />
        </FadeInView>
      </div>
    </section>
  );
}
