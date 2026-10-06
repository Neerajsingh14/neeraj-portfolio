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
import { supabaseBrowser } from "@/lib/supabase-browser";
import { profile, socials, whatsappUrl } from "@/lib/portfolio";
import { socialIcons, WhatsappIcon } from "./icons";

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
  "w-full rounded-2xl border border-white/10 bg-bg/60 px-5 py-3.5 outline-none transition placeholder:text-muted/60 focus:border-accent";

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
          size={18}
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
            className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-surface p-1.5 shadow-2xl shadow-black/60"
          >
            {reasons.map((r) => (
              <li key={r} role="option" aria-selected={r === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(r);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition ${
                    r === value
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:bg-white/5 hover:text-fg"
                  }`}
                >
                  {r}
                  {r === value && <Check size={16} />}
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
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const sb = supabaseBrowser();

    let { error } = await sb.from("messages").insert(form);

    // agar "reason" column abhi database me nahi bana, to reason message ke saath jod do
    if (error) {
      ({ error } = await sb.from("messages").insert({
        name: form.name,
        email: form.email,
        message: `[${form.reason}] ${form.message}`,
      }));
    }

    if (error) {
      setStatus("error");
    } else {
      setStatus("sent");
      setForm(empty);
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
    <section id="contact" className="wrap py-20 md:py-28">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something"
        subtitle="Have an idea, an opportunity or just want to say hi? Message me anywhere and I'll get back to you soon."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <Reveal>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/20 to-transparent p-6 transition hover:border-[#25D366]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-[#04210f] transition group-hover:scale-110">
                <WhatsappIcon size={28} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold">Chat on WhatsApp</p>
                <p className="text-sm text-muted">The fastest way to reach me</p>
              </div>
            </a>
          </Reveal>

          {details.map((d, i) => {
            const Icon = d.icon;
            const body = (
              <>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted">
                    {d.label}
                  </p>
                  <p className="truncate text-fg">{d.value}</p>
                </div>
              </>
            );
            const cls =
              "flex items-center gap-4 rounded-3xl border border-white/10 bg-surface p-5 transition hover:border-accent/50";
            return (
              <Reveal key={d.label} delay={0.08 + i * 0.08}>
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

          <Reveal delay={0.35} className="flex flex-wrap items-center gap-3 pt-2">
            {socials
              .filter((s) => s.key !== "whatsapp")
              .map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-muted transition hover:border-accent hover:text-accent"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm transition hover:border-accent hover:text-accent"
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
                className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-accent/30 bg-surface p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent"
                >
                  <CircleCheck size={34} />
                </motion.div>
                <h3 className="mt-5 text-2xl font-semibold">Message sent!</h3>
                <p className="mt-2 max-w-xs text-muted">
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
                className="relative flex flex-col gap-5 rounded-3xl border border-white/10 bg-surface p-6 md:p-8"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
                </div>

                <div className="relative">
                  <p className="font-display text-xl font-semibold">
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
                    placeholder="Tell me about your project or opportunity..."
                    className={`${input} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  disabled={status === "sending"}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-fg transition hover:scale-[1.02] disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send message
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="relative text-sm text-red-400">
                    Something went wrong. Please try again or message me on
                    WhatsApp.
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