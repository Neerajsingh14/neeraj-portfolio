import type { Metadata } from "next";
import { Sora, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// Headings
const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Body text
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Labels, logo, code
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neeraj Singh Rajpurohit | AI Powered Web Developer",
  description:
    "Portfolio of Neeraj Singh Rajpurohit, an AI powered web developer from Bengaluru building fast, responsive interfaces with React, Next.js and Tailwind CSS.",
};

// Page paint hone se pehle saved theme laga deta hai, taaki rang badalta hua na dikhe
const themeInit = `(function(){try{var t=localStorage.getItem("portfolio-theme");if(t==="violet"||t==="sunset"||t==="ocean"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}