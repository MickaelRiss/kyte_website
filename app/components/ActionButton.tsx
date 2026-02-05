import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  textSize?: string;
  textContent?: string;
}

export default function ActionButton({
  textSize = "text-sm",
  textContent = "Get Started",
}: Props) {
  return (
    <Link href="#download">
      <Button className="group relative overflow-hidden text-card bg-primary/90 cursor-pointer transition-all ease-in-out duration-300 hover:bg-primary shadow-lg">
        <span className={`relative z-10 flex items-center gap-2 ${textSize}`}>
          {textContent}
        </span>
        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-800" />
      </Button>
    </Link>
  );
}
