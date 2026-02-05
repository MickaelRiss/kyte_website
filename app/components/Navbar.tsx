import ActionButton from "./ActionButton";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ sections }: { sections: string[] }) {
  return (
    <header className="mx-auto max-w-6xl bg-background/10 backdrop-blur-sm border-b border-border/10 px-6 py-4 fixed top-1 left-0 right-0 z-50 rounded-xl shadow-sm">
      <nav className="flex items-center justify-between">
        <Link
          className="text-xl font-semibold flex gap-2 justify-center items-end"
          href="/"
          scroll={true}
        >
          <Image
            src="/logo.svg"
            alt="Kyte"
            width="32"
            height="32"
            className="h-8 w-8 pb-1"
          />
          <span>Kyte</span>
        </Link>

        <ul className="hidden sm:flex gap-8">
          {sections.map((section) => (
            <li key={section}>
              <Link
                className="text-sm transition-all ease-in-out hover:text-primary duration-300"
                href={`#${section.toLowerCase()}`}
                scroll={true}
              >
                {section}
              </Link>
            </li>
          ))}
        </ul>
        <ActionButton textSize="text-xs" />
      </nav>
    </header>
  );
}
