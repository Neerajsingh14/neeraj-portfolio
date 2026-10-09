"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, RotateCcw, Save, Undo2 } from "lucide-react";
import { resetContent, saveContent } from "@/lib/actions";
import type { Field } from "@/lib/admin-schemas";
import { cleanForSave, FieldGrid } from "./FormKit";
import { useAdmin, useDirtyGuard } from "./AdminContext";
import { ActionBar, btnGhost, btnPrimary, PageHeader, StatusDot } from "./ui";

export default function ObjectEditor({
  sectionKey,
  eyebrow,
  title,
  description,
  fields,
  initial,
  isCustom,
  previewHref,
}: {
  sectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  fields: Field[];
  initial: Record<string, unknown>;
  isCustom: boolean;
  previewHref?: string;
}) {
  const { toast } = useAdmin();
  const [data, setData] = useState<Record<string, unknown>>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [pending, start] = useTransition();

  const dirty = JSON.stringify(data) !== saved;
  useDirtyGuard(dirty);

  const set = (key: string, value: unknown) =>
    setData((d) => ({ ...d, [key]: value }));

  const save = () =>
    start(async () => {
      const clean = cleanForSave(fields, data);
      const res = await saveContent(sectionKey, clean);
      if (res.ok) {
        setData(clean);
        setSaved(JSON.stringify(clean));
        toast("ok", "Saved. Site update ho gayi.");
      } else {
        toast("err", res.error ?? "Save nahi hua");
      }
    });

  const discard = () => setData(JSON.parse(saved) as Record<string, unknown>);

  const reset = () => {
    if (!confirm("Saare badlav hata kar default content wapas lagayen?")) return;
    start(async () => {
      const res = await resetContent(sectionKey);
      if (res.ok) window.location.reload();
      else toast("err", res.error ?? "Reset nahi hua");
    });
  };

  // Ctrl+S / Cmd+S
  const saveRef = useRef<() => void>(() => {});
  useEffect(() => {
    saveRef.current = () => {
      if (dirty && !pending) save();
    };
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        previewHref={previewHref}
      />

      <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-5 sm:p-8">
        <FieldGrid fields={fields} values={data} onChange={set} />
      </div>

      <ActionBar>
        <StatusDot dirty={dirty} />
        {isCustom && (
          <button onClick={reset} disabled={pending} className={btnGhost}>
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset to default</span>
          </button>
        )}
        {dirty && (
          <button onClick={discard} disabled={pending} className={btnGhost}>
            <Undo2 size={15} />
            Discard
          </button>
        )}
        <button
          onClick={save}
          disabled={!dirty || pending}
          className={btnPrimary}
          title="Ctrl + S"
        >
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save changes
        </button>
      </ActionBar>
    </div>
  );
}