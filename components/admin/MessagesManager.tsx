"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  Mail,
  MailCheck,
  Reply,
  Send,
  Trash2,
} from "lucide-react";
import { deleteMessage, markMessage, sendTestEmail } from "@/lib/actions";
import { useAdmin } from "./AdminContext";
import { btnGhost, PageHeader } from "./ui";

export type Msg = {
  id: string;
  name: string;
  email: string;
  reason: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg disabled:opacity-40";

export default function MessagesManager({
  messages,
  mailOn,
  to,
}: {
  messages: Msg[];
  mailOn: boolean;
  to: string;
}) {
  const router = useRouter();
  const { toast } = useAdmin();
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const unread = messages.filter((m) => !m.read);
  const list = tab === "unread" ? unread : messages;

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>, okText?: string) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        if (okText) toast("ok", okText);
        router.refresh();
      } else {
        toast("err", r.error ?? "Failed");
      }
    });

  const markAll = () =>
    start(async () => {
      const results = await Promise.all(unread.map((m) => markMessage(m.id, true)));
      const bad = results.find((r) => !r.ok);
      if (bad) toast("err", bad.error ?? "Failed");
      else toast("ok", "Sab read mark ho gaye");
      router.refresh();
    });

  const test = () =>
    start(async () => {
      const r = await sendTestEmail();
      if (r.ok) toast("ok", "Test mail bhej di. Inbox aur Spam dono check karo.");
      else toast("err", `Mail fail: ${r.error}`);
    });

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Contact form ke saare messages yahan save hote hain."
      />

      {/* mail status */}
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-surface p-5">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            mailOn ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
          }`}
        >
          {mailOn ? <MailCheck size={22} /> : <Mail size={22} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {mailOn ? "Email alerts ON" : "Email alerts OFF"}
          </p>
          <p className="text-sm text-muted">
            {mailOn
              ? `Har naye message par ${to} par mail aayegi.`
              : ".env.local me RESEND_API_KEY aur CONTACT_TO_EMAIL daalo, phir server restart karo."}
          </p>
        </div>
        <button onClick={test} disabled={pending || !mailOn} className={btnGhost}>
          <Send size={15} />
          Send test email
        </button>
      </div>

      {/* tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-white/10 bg-bg/60 p-1">
          {(
            [
              ["all", `All (${messages.length})`],
              ["unread", `Unread (${unread.length})`],
            ] as const
          ).map(([k, text]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-4 py-1.5 text-sm transition ${
                tab === k ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
        {unread.length > 0 && (
          <button onClick={markAll} disabled={pending} className={btnGhost}>
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[15px] text-muted">
            {tab === "unread" ? "Koi unread message nahi." : "Abhi koi message nahi aaya."}
          </div>
        )}

        {list.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border bg-surface p-5 ${
              m.read ? "border-white/10" : "border-accent/40"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-base font-bold text-accent-fg">
                  {(m.name || "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    <span className="truncate">{m.name}</span>
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="block truncate text-sm text-muted transition hover:text-accent"
                  >
                    {m.email}
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {m.reason && (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
                    {m.reason}
                  </span>
                )}
                <span
                  suppressHydrationWarning
                  className="font-mono text-xs text-muted"
                >
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-muted">
              {m.message}
            </p>

            <div className="mt-4 flex items-center gap-1">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                className="mr-2 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:brightness-110"
              >
                <Reply size={15} /> Reply
              </a>
              <button
                className={iconBtn}
                disabled={pending}
                title={m.read ? "Mark unread" : "Mark read"}
                onClick={() => act(() => markMessage(m.id, !m.read))}
              >
                <CheckCheck size={17} />
              </button>
              <button
                className={`${iconBtn} hover:!text-red-400`}
                disabled={pending}
                title="Delete"
                onClick={() => {
                  if (confirm("Ye message delete karna hai?"))
                    act(() => deleteMessage(m.id), "Message delete ho gaya");
                }}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}