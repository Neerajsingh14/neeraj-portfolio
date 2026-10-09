"use client";
import { Fragment, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Field } from "@/lib/admin-schemas";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-bg/60 px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/60 hover:border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/10";

/* save se pehle khali lines hatana aur text trim karna */
export function cleanForSave<T extends Record<string, unknown>>(
  fields: Field[],
  obj: T
): T {
  const out: Record<string, unknown> = { ...obj };
  for (const f of fields) {
    const v = out[f.key];
    if (f.type === "lines" && Array.isArray(v)) {
      out[f.key] = v.map((s) => String(s).trim()).filter(Boolean);
    } else if (
      (f.type === "text" || f.type === "url" || f.type === "textarea") &&
      typeof v === "string"
    ) {
      out[f.key] = v.trim();
    }
  }
  return out as T;
}

/* ---------------- tags ---------------- */
function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    parts.forEach((p) => {
      if (!next.includes(p)) next.push(p);
    });
    onChange(next);
    setDraft("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-bg/60 p-2.5 transition hover:border-white/20 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-sm text-accent"
        >
          {t}
          <button
            type="button"
            aria-label={`Remove ${t}`}
            onClick={() => onChange(value.filter((x) => x !== t))}
            className="opacity-70 transition hover:opacity-100"
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : placeholder ?? "Type and press Enter"}
        className="min-w-[140px] flex-1 bg-transparent px-2 py-1 text-[15px] outline-none placeholder:text-muted/60"
      />
    </div>
  );
}

/* ---------------- image upload (drag and drop) ---------------- */
function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const upload = async (file: File) => {
    setErr("");
    if (!file.type.startsWith("image/")) {
      setErr("Sirf image file chuno");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("Image 10MB se choti honi chahiye");
      return;
    }

    setBusy(true);
    const sb = supabaseBrowser();
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${folder}/${Date.now()}-${safe}`;

    const { error } = await sb.storage
      .from("portfolio")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    const { data } = sb.storage.from("portfolio").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition sm:flex-row sm:items-center ${
          drag ? "border-accent bg-accent/10" : "border-white/15 bg-bg/40"
        }`}
      >
        <div className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-bg/60 sm:w-52">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <Upload size={26} className="text-muted/60" />
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {busy ? "Uploading..." : "Drag and drop an image here"}
          </p>
          <p className="mt-1 text-xs text-muted">PNG, JPG or WebP, 10MB tak</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm transition hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <ImagePlus size={16} />
              {value ? "Replace image" : "Browse files"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:border-red-400/60 hover:text-red-400"
              >
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ya image ka link / path likho (jaise /projects/shot.png)"
        className={inputCls}
      />
      {err && <p className="text-sm text-red-400">{err}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- ek field ---------------- */
export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const text = typeof value === "string" ? value : "";
  const list = Array.isArray(value) ? (value as string[]) : [];

  let control: React.ReactNode = null;
  let extra: React.ReactNode = null;

  switch (field.type) {
    case "text":
    case "url":
      control = (
        <input
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          inputMode={field.type === "url" ? "url" : undefined}
          className={inputCls}
        />
      );
      break;

    case "textarea":
      control = (
        <textarea
          rows={5}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      );
      break;

    case "lines": {
      const n = list.filter((s) => s.trim()).length;
      control = (
        <textarea
          rows={5}
          value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={field.placeholder}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      );
      extra = <span className="font-mono text-xs text-muted">{n} lines</span>;
      break;
    }

    case "tags":
      control = (
        <TagsInput value={list} onChange={onChange} placeholder={field.placeholder} />
      );
      break;

    case "color": {
      const hex = /^#[0-9a-fA-F]{6}$/.test(text) ? text : "#38bdf8";
      control = (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
          />
          <input
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#38bdf8"
            className={inputCls}
          />
        </div>
      );
      break;
    }

    case "toggle":
      control = (
        <button
          type="button"
          role="switch"
          aria-checked={value === true}
          onClick={() => onChange(!(value === true))}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg/60 px-4 py-3 transition hover:border-white/20"
        >
          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              value === true ? "bg-accent" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                value === true ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
          <span className="text-[15px]">
            {value === true ? "Visible on site" : "Hidden"}
          </span>
        </button>
      );
      break;

    case "image":
      control = (
        <ImageField value={text} onChange={onChange} folder={field.folder} />
      );
      break;
  }

  return (
    <div className={field.half ? "" : "sm:col-span-2"}>
      <div className="mb-2 flex items-end justify-between gap-3">
        <span className="text-sm font-medium">{field.label}</span>
        {extra}
      </div>
      {control}
      {field.hint && (
        <p className="mt-2 text-xs leading-relaxed text-muted/80">{field.hint}</p>
      )}
    </div>
  );
}

/* ---------------- fields ka grid (group headings ke saath) ---------------- */
export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: Field[];
  values: Record<string, unknown>;
  onChange: (key: string, v: unknown) => void;
}) {
  let last = "";
  return (
    <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      {fields.map((f) => {
        const head = f.group && f.group !== last ? f.group : null;
        if (f.group) last = f.group;
        return (
          <Fragment key={f.key}>
            {head && (
              <div className="flex items-center gap-3 pt-3 first:pt-0 sm:col-span-2">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  {head}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            )}
            <FieldRenderer
              field={f}
              value={values[f.key]}
              onChange={(v) => onChange(f.key, v)}
            />
          </Fragment>
        );
      })}
    </div>
  );
}