import FadeInView from "../FadeInView";
import { Flame, EyeOff, FileX } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 lg:px-0">
      <FadeInView delay={0.1}>
        <h2 className="text-4xl font-bold text-center mb-4">
          One Mistake. Everything Lost.
        </h2>
        <p className="text-center text-lg text-gray-400 mb-16">
          Why traditional seed phrase storage is broken
        </p>
      </FadeInView>

      <div className="grid md:grid-cols-3 gap-8">
        <FadeInView delay={0.2}>
          <div className="bg-card/60 shadow-md border border-border rounded-lg p-6">
            <Flame color="red" size={24} className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Single Point of Failure
            </h3>
            <p className="text-muted">
              One fire. One flood. One moment of forgetfulness. Traditional
              backups put your entire portfolio at risk from a single disaster.
            </p>
          </div>
        </FadeInView>
        <FadeInView delay={0.4}>
          <div className="bg-card/60 shadow-md border border-border rounded-lg p-6">
            <EyeOff color="red" size={24} className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Zero Privacy Protection
            </h3>
            <p className="text-muted">
              Seed phrases don&apos;t have &quot;read-only&quot; mode. Discovery
              equals theft. Your security is only as strong as your hiding spot.
            </p>
          </div>
        </FadeInView>
        <FadeInView delay={0.6}>
          <div className="bg-card/60 shadow-md border border-border rounded-lg p-6">
            <FileX color="red" size={24} className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Unrecoverable for Heirs
            </h3>
            <p className="text-muted">
              Without a secure inheritance plan, your crypto dies with you. Your
              family loses everything because they can&apos;t access what&apos;s
              rightfully theirs.
            </p>
          </div>
        </FadeInView>
      </div>
      <FadeInView delay={0.5}>
        <div className="mt-16 text-center">
          <p className="text-4xl font-bold text-primary mb-2">$140B+</p>
          <p className="text-gray-400">
            Lost in crypto due to lost or stolen seed phrases
          </p>
        </div>
      </FadeInView>
    </section>
  );
}
