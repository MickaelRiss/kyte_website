import { Button } from "./ui/button";
import { Clock } from "lucide-react";
import Image from "next/image";

interface OS {
  logo: string;
  name: string;
  released: boolean;
  url?: string;
}

export default function DownloadButton({ os }: { os: OS }) {
  if (os.released) {
    const button = (
      <Button
        aria-label={`Download on ${os.name}`}
        variant="outline"
        className="group relative overflow-hidden bg-card/80 hover:bg-card border border-border hover:border-primary/50 rounded-xl p-6 h-auto w-full sm:w-64 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-4">
          <div className="shrink-0 transition-transform duration-300">
            <Image
              src={os.logo}
              alt={os.name}
              width={40}
              height={40}
              className="drop-shadow-md"
            />
          </div>
          <div className="flex flex-col items-start flex-1">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">
              Download for
            </p>
            <p className="text-white font-semibold text-base">{os.name}</p>
          </div>
        </div>
      </Button>
    );

    if (os.url) {
      return <a href={os.url}>{button}</a>;
    }

    return button;
  }

  return (
    <div className="relative group bg-card/40 border border-border/50 rounded-xl p-6 h-auto w-full sm:w-64 opacity-60 cursor-not-allowed">
      <div className="absolute -top-3 -right-3 bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
        <Clock size={12} />
        <span>Coming Soon</span>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="shrink-0 grayscale opacity-50">
          <Image
            src={os.logo}
            alt={os.name}
            width={40}
            height={40}
            className="drop-shadow-md"
          />
        </div>
        <div className="flex flex-col items-start flex-1">
          <p className="text-muted text-xs font-medium tracking-wide uppercase">
            Coming to
          </p>
          <p className="text-muted font-semibold text-base">{os.name}</p>
        </div>
      </div>
    </div>
  );
}
