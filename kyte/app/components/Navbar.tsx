import { Button } from "@/app/components/ui/button";
import Image from "next/image";

export default function Navbar({ sections }: { sections: string[] }) {
  return (
    <header className="mx-auto max-w-6xl bg-background/10 backdrop-blur-sm border-b border-border/10 px-6 py-4 fixed top-1 left-0 right-0 z-50 rounded-xl shadow-sm">
      <nav className="flex items-center justify-between">
        <div className="text-xl font-semibold flex gap-2 justify-center items-end">
          <Image
            src="/logo.svg"
            alt="Kyte"
            width="32"
            height="32"
            className="h-8 w-8 pb-1"
          />
          <span>Kyte</span>
        </div>

        <ul className="hidden sm:flex gap-8">
          {sections.map((section) => (
            <li key={section}>
              <a className="text-sm" href={`#${section.toLowerCase()}`}>
                {section}
              </a>
            </li>
          ))}
        </ul>

        <Button className="text-foreground bg-primary/90 text-xs">
          Get Started
        </Button>
      </nav>
    </header>
  );
}
