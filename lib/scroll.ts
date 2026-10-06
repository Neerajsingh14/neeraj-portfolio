type LenisLike = {
  scrollTo: (target: HTMLElement | number, opts?: { offset?: number }) => void;
  stop: () => void;
  start: () => void;
};

const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export function scrollToId(id: string) {
  const lenis = getLenis();

  if (id === "top") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -80 });
  } else {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  }
}

export function lockScroll(lock: boolean) {
  const lenis = getLenis();
  if (lock) lenis?.stop();
  else lenis?.start();
  document.body.style.overflow = lock ? "hidden" : "";
}