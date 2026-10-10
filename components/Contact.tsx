"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  CircleCheck,
  Download,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SocialLink from "./SocialLink";

import { useSite } from "./SiteProvider";
import { WhatsappIcon } from "./icons";

const reasons = [
  "Project Build",
  "Freelance Collaboration",
  "Full-Time Opportunity",
  "Technical Consulting",
  "Other",
];

const empty = { name: "", email: "", reason: reasons[0], message: "" };

const label = "mb-2 block text-sm font-medium";
const input =
  "w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent";

function ReasonSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id="c-reason"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${input} flex items-center justify-between text-left ${
          open ? "border-accent" : ""
        }`}
      >
        <span>{value}</span>
        <ChevronDown
          size={17}
          className={`text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-surface p-1.5 shadow-2xl shadow-black/60"
          >
            {reasons.map((r) => (
              <li key={r} role="option" aria-selected={r === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(r);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm transition ${
                    r === value
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:bg-white/5 hover:text-fg"
                  }`}
                >
                  {r}
                  {r === value && <Check size={15} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { profile, socials, whatsappUrl } = useSite();
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("sent");
        setForm(empty);
      } else {
        setErrorMsg(typeof json.error === "string" ? json.error : "");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network problem. Please check your internet and try again.");
      setStatus("error");
    }
  };

  const details = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    { icon: MapPin, label: "Location", value: profile.location, href: "" },
  ];

  return (
    <section id="contact" className="wrap py-16 md:py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something"
        subtitle="I'm available for freelance projects, full-time roles and internships. Message me anywhere and I'll get back to you soon."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        {/* LEFT */}
        <div className="flex flex-col gap-3">
          <Reveal>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/15 to-transparent p-5 transition hover:border-[#25D366]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-[#04210f] transition group-hover:scale-110">
                <WhatsappIcon size={24} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Chat on WhatsApp</p>
                <p className="text-xs text-muted">The fastest way to reach me</p>
              </div>
            </a>
          </Reveal>

          {details.map((d, i) => {
            const Icon = d.icon;
            const body = (
              <>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {d.label}
                  </p>
                  <p className="truncate text-sm">{d.value}</p>
                </div>
              </>
            );
            const cls =
              "flex items-center gap-4 rounded-2xl border border-white/10 bg-surface p-4 transition hover:border-accent/50";
            return (
              <Reveal key={d.label} delay={0.06 + i * 0.06}>
                {d.href ? (
                  <a href={d.href} className={cls}>
                    {body}
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </Reveal>
            );
          })}

          <Reveal delay={0.3} className="flex flex-wrap items-center gap-2.5 pt-1">
            {socials
              .filter((s) => s.key !== "whatsapp")
              .map((s) => (
                <SocialLink key={s.key} social={s} iconSize={19} box="h-11 w-11" />
              ))}
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm transition hover:border-accent hover:text-accent"
            >
              <Download size={16} />
              Resume
            </a>
          </Reveal>
        </div>

        {/* RIGHT: form */}
        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-surface p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent"
                >
                  <CircleCheck size={32} />
                </motion.div>
                <h3 className="mt-5 text-xl font-semibold">Message sent!</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Thanks for reaching out. I will get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={send}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 md:p-8"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
                </div>

                <div className="relative">
                  <p className="font-display text-lg font-semibold">
                    Send me a message
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Usually replies within 24 hours.
                  </p>
                </div>

                <div className="relative grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className={label}>
                      Name
                    </label>
                    <input
                      id="c-name"
                      required
                      placeholder="Your full name"
                      className={input}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={label}>
                      Email
                    </label>
                    <input
                      id="c-email"
                      required
                      type="email"
                      placeholder="you@example.com"
                      className={input}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="c-reason" className={label}>
                    Reason
                  </label>
                  <ReasonSelect
                    value={form.reason}
                    onChange={(v) => setForm({ ...form, reason: v })}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="c-message" className={label}>
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    required
                    rows={5}
                    minLength={2}
                    placeholder="Tell me about your project or opportunity..."
                    className={`${input} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  disabled={status === "sending"}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-fg transition hover:scale-[1.02] disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send message
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="relative text-sm text-red-400">
                    {errorMsg || "Something went wrong. Please try again or message me on WhatsApp."}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}