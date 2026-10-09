"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type W = Window & { __lenis?: Lenis };

// Lenis sirf public site par chalta hai. Admin me ye wheel scroll rok deta tha
// (sidebar scroll nahi hota tha), isliye /admin par band.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const off = pathname.startsWith("/admin");

  useEffect(() => {
    if (off) return;

    const lenis = new Lenis({ duration: 1.2 });
    (window as W).__lenis = lenis;

    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      delete (window as W).__lenis;
    };
  }, [off]);

  return <>{children}</>;
}