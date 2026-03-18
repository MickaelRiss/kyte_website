import { Button } from "../ui/button";
import FadeInView from "../FadeInView";
import Link from "next/link";

export default function Demo() {
  return (
    <section className="relative z-10 mt-32 max-w-5xl mx-auto lg:px-0 pt-14 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeInView delay={0.1}>
          <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
        </FadeInView>
        <FadeInView delay={0.2}>
          <p className="text-lg text-gray-400 mb-8">
            Watch how Kyte protects your crypto in under 2 minutes
          </p>
        </FadeInView>
        <FadeInView delay={0.3}>
          <div className="aspect-video bg-background border border-primary/20 rounded-lg overflow-hidden">
            <video controls preload="none" className="w-full h-full">
              <source src="/demo_kyte.mp4" type="video/mp4" />
              <track srcLang="en" label="English" />
              Your browser does not support the video tag.
            </video>
          </div>
        </FadeInView>
        <FadeInView delay={0.1}>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="https://kyte.gitbook.io/kyte-docs/" target="_blank">
              <Button
                variant="outline"
                className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Read Docs
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
