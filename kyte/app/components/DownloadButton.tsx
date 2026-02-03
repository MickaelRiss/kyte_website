import { Button } from "./ui/button";
import Image from "next/image";

interface OS {
  logo: string;
  name: string;
}

export default function DownloadButton({ os }: { os: OS }) {
  return (
    <Button
      size="icon-sm"
      aria-label={`Download on ${os.name}`}
      variant="outline"
      className="group relative overflow-hidden bg-card/80 hover:bg-card border border-border hover:border-primary/50 rounded-xl px-6 py-8 w-full sm:w-64 transition-all duration-300 shadow-md hover:shadow-primary/10 cursor-pointer"
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <Image
        src={os.logo}
        alt={os.name}
        width={36}
        height={36}
        className="drop-shadow-md"
      />
      <div className="flex flex-col gap-2 pl-6">
        <p className="text-muted text-xs">DOWNLOAD FOR</p>
        <p className="text-white font-semibold">{os.name}</p>
      </div>
    </Button>
  );
}
