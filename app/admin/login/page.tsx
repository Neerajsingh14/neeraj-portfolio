"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  Pencil,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const features = [
  { icon: Pencil, title: "Edit every section", text: "Hero, projects, skills and more, without touching code." },
  { icon: Layers, title: "Multiple profiles", text: "AI Powered, Frontend, or any role you need." },
  { icon: ImagePlus, title: "Image uploads", text: "Screenshots and photos go straight to storage." },
  { icon: MailCheck, title: "Email alerts", text: "Contact form messages land in your inbox." },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Wrong email or password");
      setShake((n) => n + 1);
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-bg/60 py-3.5 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-muted/60 hover:border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/10";

  return (
    <main className="grid min-h-screen bg-bg lg:grid-cols-[1.1fr_1fr]">
      {/* LEFT: brand */}
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 420px at 15% 8%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%), radial-gradient(600px 400px at 90% 95%, color-mix(in srgb, var(--accent-2) 16%, transparent), transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 30% 30%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 30%, black, transparent 75%)",
          }}
        />

        <p className="relative font-mono text-2xl font-bold">
          <span className="text-accent">&lt;</span>Admin
          <span className="text-accent">/&gt;</span>
        </p>

        <div className="relative max-w-lg">
          <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
            Your portfolio,{" "}
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              fully in your control.
            </span>
          </h2>
          <p className="mt-4 text-base text-muted">
            Update content, switch profiles and read messages from one clean dashboard.
          </p>

          <ul className="mt-9 space-y-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.li
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-semibold">{f.title}</span>
                    <span className="block text-sm text-muted">{f.text}</span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* mock preview */}
        <div className="relative max-w-sm rounded-2xl border border-white/10 bg-surface/70 p-4 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-full animate-pulse rounded bg-white/5" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-accent/20 px-3 py-1 font-mono text-[11px] text-accent">
              Saved
            </span>
            <span className="rounded-lg bg-white/5 px-3 py-1 font-mono text-[11px] text-muted">
              Live on site
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT: form */}
      <section className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xl font-bold lg:invisible">
            <span className="text-accent">&lt;</span>Admin
            <span className="text-accent">/&gt;</span>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <motion.form
            key={shake}
            onSubmit={submit}
            initial={{ opacity: 0, y: 14 }}
            animate={error ? { x: [0, -10, 10, -7, 7, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: error ? 0.4 : 0.5 }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-surface/80 shadow-2xl shadow-black/50"
          >
            <span className="block h-1 bg-gradient-to-r from-accent to-accent-2" />
            <div className="p-7 sm:p-9">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="mt-2 text-[15px] text-muted">
                Login to manage your portfolio.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    required
                    autoFocus
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    required
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`${input} pr-14`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg"
                  >
                    {show ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading && <LoaderCircle size={18} className="animate-spin" />}
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}