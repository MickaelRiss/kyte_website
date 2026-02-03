import FadeInView from "../FadeInView";
import DownloadButton from "../DownloadButton";

const downloadOn = [
  {
    logo: "/ios.svg",
    name: "IOS",
  },
  {
    logo: "/microsoft.svg",
    name: "Microsoft",
  },
  {
    logo: "/linux.svg",
    name: "Linux",
  },
];

export default function DownloadSection() {
  return (
    <section
      className="mt-30 md:mt-40 max-w-5xl mx-auto px-6 lg:px-0"
      id="download"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-10"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-80 bg-linear-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
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
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-primary/30 to-background opacity-40 sm:left-[calc(50%+36rem)] sm:w-200"
        />
      </div>
      <FadeInView delay={0.1}>
        <h2 className="text-4xl font-bold text-center">
          Ready to secure your future ?
        </h2>
      </FadeInView>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-20 mt-16">
        {downloadOn.map((os) => (
          <div key={os.name}>
            <FadeInView delay={0.2}>
              <DownloadButton os={os} />
            </FadeInView>
          </div>
        ))}
      </div>
      <FadeInView delay={0.2}>
        <p className="text-muted text-sm text-center mt-12">
          Current Version: 1.0.1 (LTS) - Released in Jan 2026
        </p>
      </FadeInView>
    </section>
  );
}
