import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col mx-auto max-w-6xl border-t border-border p-6 shadow-sm md:flex-row gap-4 items-center justify-between">
        <div className="text-md flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Kyte"
            width="32"
            height="32"
            className="h-8 w-8 pb-1"
          />
          <span>Kyte</span>
        </div>
        <div className="flex items-center text-xs gap-6">
          <Link
            href="https://github.com/MickaelRiss/kyte"
            target="_blank"
            className="hover:text-foreground/80 transition-all ease-in-out duration-300"
          >
            GitHub
          </Link>
          <Link
            href="#download"
            className="hover:text-foreground/80 transition-all ease-in-out duration-300"
          >
            Download
          </Link>
          <Link
            href="#privacy"
            className="hover:text-foreground/80 transition-all ease-in-out duration-300"
          >
            Privacy
          </Link>
        </div>
        <p className="text-gray-500 dark:text-neutral-300 transition hover:opacity-75 text-xs">
          © 2026 kyte.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
