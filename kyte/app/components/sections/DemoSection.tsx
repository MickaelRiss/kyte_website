import { Button } from "../ui/button";
import FadeInView from "../FadeInView";

export default function Demo() {
  return (
    <section className="mt-32 max-w-5xl mx-auto px-6 lg:px-0 bg-card/30">
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
            <video controls className="w-full h-full">
              <source src="/demo.mp4" type="video/mp4" />
            </video>
          </div>
        </FadeInView>
        <FadeInView delay={0.1}>
          <div className="mt-8 flex justify-center gap-4">
            <Button className="bg-primary">Try It Free</Button>
            <Button variant="outline">Read Docs</Button>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
