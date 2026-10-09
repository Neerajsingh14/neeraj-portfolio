"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  Pencil,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const features = [
  { icon: Pencil, title: "Edit every section", text: "Hero, projects, skills and more. No code needed." },
  { icon: Layers, title: "Multiple profiles", text: "AI Powered, Frontend, or any role you need." },
  { icon: ImagePlus, title: "Image uploads", text: "Screenshots and photos go straight to storage." },
  { icon: MailCheck, title: "Email alerts", text: "Contact form messages land in your inbox." },
];

const label = "mb-2 block text-sm font-medium";

export default function AdminLogin() {
  const router = useRouter();
  const shake = useAnimationControls();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Wrong email or password. Please try again.");
      shake.start({ x: [0, -10, 10, -7, 7, 0], transition: { duration: 0.4 } });
      setLoading(false);
      return;
    }

    setDone(true);
    router.replace("/admin");
    router.refresh();
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-bg/60 py-3.5 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-muted/60 hover:border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/10";

  return (
    <main className="grid min-h-dvh bg-bg lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT: brand */}
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 420px at 12% 6%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 65%), radial-gradient(600px 420px at 95% 100%, color-mix(in srgb, var(--accent-2) 14%, transparent), transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 30% 35%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 35%, black, transparent 75%)",
          }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-10 top-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative flex h-full min-h-dvh flex-col justify-between gap-10 p-10 xl:p-14">
          <div className="flex items-center justify-between">
            <p className="font-mono text-2xl font-bold">
              <span className="text-accent">&lt;</span>Admin
              <span className="text-accent">/&gt;</span>
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-muted">
              <ShieldCheck size={14} className="text-accent" />
              Private area
            </span>
          </div>

          <div className="max-w-xl">
            <h2 className="text-4xl font-bold leading-[1.1] xl:text-5xl">
              Your portfolio,{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                fully in your control.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Update content, switch profiles and read messages from one clean
              dashboard.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-surface/60 p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Icon size={19} />
                    </span>
                    <p className="mt-3 font-semibold">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="text-sm text-muted/80">
            Only the site owner can sign in. All changes go live as soon as you save.
          </p>
        </div>
      </section>

      {/* RIGHT: form */}
      <section className="relative flex flex-col px-5 py-6 sm:px-10">
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{
            background:
              "radial-gradient(520px 320px at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <p className="font-mono text-xl font-bold lg:hidden">
            <span className="text-accent">&lt;</span>Admin
            <span className="text-accent">/&gt;</span>
          </p>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <motion.form
              onSubmit={submit}
              animate={shake}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-black/50"
            >
              <span className="block h-1 bg-gradient-to-r from-accent to-accent-2" />

              <div className="p-7 sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-accent-fg">
                  <Lock size={22} />
                </span>
                <h1 className="mt-5 text-3xl font-bold">Welcome back</h1>
                <p className="mt-2 text-[15px] text-muted">
                  Login to manage your portfolio.
                </p>

                <div className="mt-8 flex flex-col gap-5">
                  <div>
                    <label htmlFor="a-email" className={label}>
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="a-email"
                        required
                        autoFocus
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="a-pass" className={label}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                      />
                      <input
                        id="a-pass"
                        required
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={`${input} pr-14`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
                        onBlur={() => setCaps(false)}
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

                    <AnimatePresence>
                      {caps && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <span className="mt-2 flex items-center gap-2 text-sm text-amber-300">
                            <TriangleAlert size={15} />
                            Caps Lock is on
                          </span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
                      >
                        <TriangleAlert size={16} className="mt-0.5 shrink-0" />
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    disabled={loading || done}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.98] disabled:opacity-80"
                  >
                    {done ? (
                      <>
                        <Check size={18} />
                        Signed in
                      </>
                    ) : loading ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.form>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck size={14} />
              Secured sign in. Your session stays private to this browser.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}