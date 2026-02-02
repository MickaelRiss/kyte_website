import { WholeWord, FileLock, Share2 } from "lucide-react";
import Fragment from "./Fragment";
import FadeInView from "./FadeInView";

export default function SolutionSection() {
  return (
    <section className="relative mt-40 px-6 lg:px-0">
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

        <div className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 md:px-0">
            <div>
                <FadeInView delay={0.1}>
                    <h2 className="text-4xl font-bold mb-4">
                        Security, Fragmented.
                    </h2>
                </FadeInView>
                <FadeInView delay={0.2}>
                    <p className="text-lg text-muted">
                        Split your seed phrase into encrypted shards with Kyte. No single point of
                        failure.
                    </p>
                </FadeInView>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-9">
                <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-6 shadow-lg">
                    <FadeInView delay={0.2}>
                        <div className="bg-card/80 border border-border px-6 py-6 rounded-md">
                            <WholeWord color="#c9a849" size={28} />
                            <h3 className="text-lg font-semibold my-2">1. Enter Your Seed Phrase</h3>
                            <p className="text-sm text-muted leading-relaxed">
                                Import your existing 12 or 24-word seed phrase. Add an optional 
                                password for additional encryption. Your seed never leaves your device.
                            </p>
                        </div>
                    </FadeInView>
                    
                    <FadeInView delay={0.2}>
                        <div className="bg-card/80 border border-border px-6 py-6 rounded-md shadow-lg">
                            <FileLock color="#c9a849" size={28} />
                            <h3 className="text-lg font-semibold my-2">2. Military-Grade Encryption</h3>
                            <p className="text-sm text-muted leading-relaxed">
                                Your seed is encrypted with AES-256 before splitting. Each shard is 
                                individually encrypted, ensuring zero-knowledge security.
                            </p>
                        </div>
                    </FadeInView>
                </div>
                
                <div className="md:col-span-2 lg:col-span-2">
                    <FadeInView delay={0.4}>
                        <div className="bg-card/80 border border-border px-6 py-8 rounded-md overflow-hidden shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                            <Share2 color="#c9a849" size={28} />
                            <h3 className="text-lg font-semibold">3. Distributed Redundancy</h3>
                            </div>
                            <p className="mb-8 text-sm text-muted leading-relaxed">
                            Split your secret into N parts, requiring only K parts to recover. 
                            Lose one? No problem, your funds remain secure and accessible.
                            </p>
                            <div className="w-full overflow-x-auto">
                            <Fragment />
                            </div>
                        </div>
                    </FadeInView>
                </div>
            </div>
        </div>
    </section>
  );
}
