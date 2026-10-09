import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Portfolio",
  robots: { index: false, follow: false },
};

// Sirf admin pages par lagta hai: bada font, dark scrollbar aur dark dropdowns
const css = `
html{font-size:16.5px;color-scheme:dark}
@media (max-width:640px){html{font-size:16px}}
*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px;border:2px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3);background-clip:content-box}
`;

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{css}</style>
      {children}
    </>
  );
}