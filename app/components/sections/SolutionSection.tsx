import Image from "next/image";
import { WholeWord, FileLock, Share2, ShieldCheck } from "lucide-react";
import Fragment from "../Fragment";
import FadeInView from "../FadeInView";

export default function SolutionSection() {
  return (
    <section
      className="relative max-w-5xl mx-auto lg:px-0 pt-20 px-6"
      id="solution"
    >
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

      <div className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 md:px-0 bg-card/30">
        <div>
          <FadeInView delay={0.1}>
            <h2 className="text-4xl font-bold mb-4">
              Encrypt, Split and Distribute.
            </h2>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p className="text-lg text-gray-400">
              Split your seed phrase into encrypted shards with Kyte. No single
              point of failure.
            </p>
          </FadeInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-9">
          <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-6 shadow-lg">
            <FadeInView delay={0.2}>
              <div className="bg-card/80 border border-border px-6 py-6 rounded-md shadow-lg hover:border-primary/50 transition-all duration-300 drop-shadow-2xl hover:shadow-primary/10">
                <WholeWord color="#e4c1f9" size={28} />
                <h3 className="text-lg font-semibold my-2">
                  1. Enter Your Seed Phrase
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Import your existing 12 or 24-word seed phrase. Add an
                  optional password for additional encryption. Your seed never
                  leaves your device.
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.2}>
              <div className="bg-card/80 border border-border px-6 py-6 rounded-md shadow-lg hover:border-primary/50 transition-all duration-300 drop-shadow-2xl hover:shadow-primary/10">
                <FileLock color="#c9a849" size={28} />
                <h3 className="text-lg font-semibold my-2">
                  2. Military-Grade Encryption
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Your seed is encrypted with AES-256 before splitting. Each
                  shard is individually encrypted, ensuring zero-knowledge
                  security.
                </p>
              </div>
            </FadeInView>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <FadeInView delay={0.4}>
              <div className="bg-card/80 border border-border px-6 py-8 rounded-md overflow-hidden shadow-lg hover:border-primary/50 transition-all duration-300 drop-shadow-2xl hover:shadow-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 color="#60A5FA" size={28} />
                  <h3 className="text-lg font-semibold">
                    3. Distributed Redundancy
                  </h3>
                </div>
                <p className="mb-8 text-sm text-muted leading-relaxed">
                  With Shamir secret sharing algorithm, split your secret into N
                  parts, requiring only K parts to recover. Lose one? No
                  problem, your funds remain secure and accessible.
                </p>
                <div className="w-full overflow-x-auto">
                  <Fragment />
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
        <FadeInView delay={0.1}>
          <div className="bg-card/80 border border-border px-6 py-6 rounded-md mt-6 flex flex-col gap-8 justify-between items-center md:flex-row md:gap-18 shadow-lg hover:border-primary/50 transition-all duration-300 drop-shadow-2xl hover:shadow-primary/10">
            <div className="">
              <ShieldCheck color="#4ADE80" size={28} />
              <h3 className="text-lg font-semibold my-2">
                Zero-Knowledge Architecture
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Everything happends locally on your machine. Kyte never sees
                your keys, your seed phrase or your shards. We provide the math,
                you control the secrets.
              </p>
            </div>
            <Image
              src="/kyte_solution.png"
              alt="Kyte solution"
              width="500"
              height="300"
              className="rounded-sm drop-shadow-lg"
            />
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
