"use client";
import { useSite } from "./SiteProvider";

export default function Footer() {
  const { profile } = useSite();

  return (
    <footer className="border-t border-white/10 py-6">
      <div className="wrap">
        <p className="text-xs text-muted sm:text-sm">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}