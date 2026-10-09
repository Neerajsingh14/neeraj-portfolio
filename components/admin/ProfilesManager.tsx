"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  ExternalLink,
  Pencil,
  Plus,
  Radio,
  Trash2,
  X,
} from "lucide-react";
import {
  createProfile,
  deleteProfile,
  renameProfile,
  selectProfile,
  setActiveProfile,
} from "@/lib/actions";
import { inputCls } from "./FormKit";
import { useAdmin } from "./AdminContext";
import { btnGhost, btnPrimary, PageHeader } from "./ui";

type P = { id: string; label: string };
type Res = { ok: boolean; error?: string; id?: string };

export default function ProfilesManager({
  profiles,
  active,
  current,
}: {
  profiles: P[];
  active: string;
  current: string;
}) {
  const router = useRouter();
  const { toast, confirmLeave } = useAdmin();
  const [pending, start] = useTransition();
  const [label, setLabel] = useState("");
  const [from, setFrom] = useState(current);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const run = (fn: () => Promise<Res>, okText: string, after?: () => void) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        toast("ok", okText);
        after?.();
        router.refresh();
      } else {
        toast("err", r.error ?? "Failed");
      }
    });

  const create = () =>
    run(
      async () => {
        const r = await createProfile(label, from);
        if (r.ok && r.id) await selectProfile(r.id);
        return r;
      },
      "Profile ban gaya. Ab usi ko edit kar sakte ho.",
      () => setLabel("")
    );

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/?profile=${id}`
      );
      toast("ok", "Link copy ho gaya");
    } catch {
      toast("err", "Copy nahi hua");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Site"
        title="Profiles"
        description='Har profile ka apna hero, about, skills, projects aur baaki sab alag hota hai. Jo "Live" hai wahi site ke mukhya link par dikhta hai.'
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {profiles.map((p) => {
          const live = p.id === active;
          const editing = p.id === current;
          return (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-surface p-5 transition ${
                editing ? "border-accent/50" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {editId === p.id ? (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <input
                      autoFocus
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className={`${inputCls} !py-2`}
                    />
                    <button
                      className={btnGhost}
                      disabled={pending}
                      onClick={() =>
                        run(
                          () => renameProfile(p.id, editLabel),
                          "Naam badal gaya",
                          () => setEditId(null)
                        )
                      }
                    >
                      <Check size={15} />
                    </button>
                    <button className={btnGhost} onClick={() => setEditId(null)}>
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">{p.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      ?profile={p.id}
                    </p>
                  </div>
                )}

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1 font-mono text-[11px] text-green-400">
                      <Radio size={12} /> Live
                    </span>
                  )}
                  {editing && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent">
                      Editing
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {!editing && (
                  <button
                    className={btnGhost}
                    disabled={pending}
                    onClick={() => {
                      if (!confirmLeave()) return;
                      run(() => selectProfile(p.id), "Ab ye profile edit ho raha hai");
                    }}
                  >
                    Edit this
                  </button>
                )}
                {!live && (
                  <button
                    className={btnGhost}
                    disabled={pending}
                    onClick={() =>
                      run(() => setActiveProfile(p.id), "Ye profile ab Live hai")
                    }
                  >
                    Make live
                  </button>
                )}
                <a
                  href={`/?profile=${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={btnGhost}
                >
                  <ExternalLink size={15} />
                  Preview
                </a>
                <button className={btnGhost} onClick={() => copyLink(p.id)}>
                  <Copy size={15} />
                  Copy link
                </button>
                <button
                  className={btnGhost}
                  onClick={() => {
                    setEditId(p.id);
                    setEditLabel(p.label);
                  }}
                >
                  <Pencil size={15} />
                  Rename
                </button>
                {profiles.length > 1 && (
                  <button
                    className={`${btnGhost} hover:!border-red-400/60 hover:!text-red-400`}
                    disabled={pending}
                    onClick={() => {
                      if (
                        confirm(
                          `"${p.label}" profile aur uska saara content delete karna hai?`
                        )
                      )
                        run(() => deleteProfile(p.id), "Profile delete ho gaya");
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <span className="block h-1 bg-gradient-to-r from-accent to-accent-2" />
        <div className="p-5 sm:p-7">
          <p className="text-lg font-semibold">Create new profile</p>
          <p className="mt-1 text-[15px] text-muted">
            Jaise &quot;Frontend Developer&quot;. Ye kisi existing profile ki copy banta
            hai, phir tum alag se badal sakte ho.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Profile name (jaise Frontend Developer)"
              className={inputCls}
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputCls}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  Copy from: {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={create}
            disabled={pending || !label.trim()}
            className={`${btnPrimary} mt-5`}
          >
            <Plus size={17} />
            Create profile
          </button>
        </div>
      </div>
    </div>
  );
}