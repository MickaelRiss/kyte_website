"use client";

import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function SmoothScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      lenisOptions: {
        duration: 1.2,
        smoothWheel: true,
      },
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return <div ref={scrollRef} className={className}>{children}</div>;
}
