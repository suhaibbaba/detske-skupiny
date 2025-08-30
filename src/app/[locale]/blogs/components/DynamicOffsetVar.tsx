"use client";

import { useEffect, useRef } from "react";

export default function DynamicOffsetVar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.previousElementSibling as HTMLElement | null; // assume it sits after BlogCategories
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty("--tabs-offset", `${h}px`);
      document.documentElement.style.setProperty(
        "--tabs-offset-half",
        `${h / 2}px`,
      );
    };

    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    setVar();
    return () => ro.disconnect();
  }, []);

  return <div ref={ref} aria-hidden />;
}
