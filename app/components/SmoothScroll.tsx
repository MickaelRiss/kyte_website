"use client";

import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
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

  return <div ref={scrollRef}>{children}</div>;
}
