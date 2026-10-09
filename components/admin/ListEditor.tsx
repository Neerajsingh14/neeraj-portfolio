"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Undo2,
} from "lucide-react";
import { resetContent, saveContent } from "@/lib/actions";
import type { Field } from "@/lib/admin-schemas";
import { cleanForSave, FieldGrid, inputCls } from "./FormKit";
import { useAdmin, useDirtyGuard } from "./AdminContext";
import { ActionBar, btnGhost, btnPrimary, PageHeader, StatusDot } from "./ui";

type Item = Record<string, unknown> & { id: string };
type Filter = "all" | "visible" | "hidden";

export default function ListEditor({
  sectionKey,
  eyebrow,
  title,
  description,
  noun,
  fields,
  initial,
  blank,
  titleKey,
  subtitleKey,
  thumbKey,
  isCustom,
  previewHref,
}: {
  sectionKey: string;
  eyebrow: string;
  title: string;
  description: string;
  noun: string;
  fields: Field[];
  initial: Record<string, unknown>[];
  blank: Record<string, unknown>;
  titleKey: string;
  subtitleKey?: string;
  thumbKey?: string;
  isCustom: boolean;
  previewHref?: string;
}) {
  const { toast } = useAdmin();
  const [items, setItems] = useState<Item[]>(initial as Item[]);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, start] = useTransition();

  const dirty = JSON.stringify(items) !== saved;
  useDirtyGuard(dirty);

  const hasVisible = items.some((it) => "visible" in it);
  const visibleCount = items.filter((it) => it.visible !== false).length;

  const update = (id: string, key: string, value: unknown) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? { ...it, [key]: value } : it))
    );

  const add = () => {
    const id = crypto.randomUUID();
    setQ("");
    setFilter("all");
    setItems((list) => [{ ...blank, id } as Item, ...list]);
    setOpen(id);
    setTimeout(
      () =>
        document
          .getElementById(`item-${id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80
    );
  };

  const duplicate = (i: number) =>
    setItems((list) => {
      const src = list[i];
      const copy = {
        ...src,
        id: crypto.randomUUID(),
        [titleKey]: `${String(src[titleKey] ?? "")} (copy)`,
      } as Item;
      const next = [...list];
      next.splice(i + 1, 0, copy);
      return next;
    });

  const move = (i: number, dir: -1 | 1) =>
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (i: number) => {
    const name = String(items[i][titleKey] ?? noun);
    if (!confirm(`"${name}" delete karna hai?`)) return;
    setItems((list) => list.filter((_, idx) => idx !== i));
  };

  const save = () =>
    start(async () => {
      const clean = items.map((it) => cleanForSave(fields, it));
      const res = await saveContent(sectionKey, clean);
      if (res.ok) {
        setItems(clean);
        setSaved(JSON.stringify(clean));
        toast("ok", "Saved. Site update ho gayi.");
      } else {
        toast("err", res.error ?? "Save nahi hua");
      }
    });

  const discard = () => setItems(JSON.parse(saved) as Item[]);

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

  const needle = q.trim().toLowerCase();
  const rows = items
    .map((it, i) => ({ it, i }))
    .filter(({ it }) => {
      const text = `${String(it[titleKey] ?? "")} ${
        subtitleKey ? String(it[subtitleKey] ?? "") : ""
      }`.toLowerCase();
      if (needle && !text.includes(needle)) return false;
      if (filter === "visible" && it.visible === false) return false;
      if (filter === "hidden" && it.visible !== false) return false;
      return true;
    });
  const canMove = !needle && filter === "all";

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-white/10 hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        previewHref={previewHref}
      />

      {/* toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={add} className={btnPrimary}>
          <Plus size={17} />
          Add {noun}
        </button>

        <div className="relative min-w-[200px] flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${noun}...`}
            className={`${inputCls} !py-2.5 pl-11`}
          />
        </div>

        {hasVisible && (
          <div className="flex rounded-xl border border-white/10 bg-bg/60 p-1">
            {(["all", "visible", "hidden"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3.5 py-1.5 text-sm capitalize transition ${
                  filter === f
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-fg"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 font-mono text-xs text-muted">
        {items.length} total
        {hasVisible ? `, ${visibleCount} visible` : ""}
        {rows.length !== items.length ? `, ${rows.length} shown` : ""}
      </p>

      {/* list */}
      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-[15px] text-muted">
            {items.length === 0
              ? `Abhi koi ${noun} nahi hai. Upar "Add ${noun}" dabao.`
              : "Is search ya filter me kuch nahi mila."}
          </div>
        )}

        {rows.map(({ it, i }) => {
          const isOpen = open === it.id;
          const hidden = it.visible === false;
          const thumb = thumbKey ? String(it[thumbKey] ?? "") : "";
          const name = String(it[titleKey] ?? "") || "Untitled";
          const sub = subtitleKey ? String(it[subtitleKey] ?? "") : "";

          return (
            <motion.div
              key={it.id}
              id={`item-${it.id}`}
              layout="position"
              transition={{ duration: 0.25 }}
              className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
                isOpen ? "border-accent/50" : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : it.id)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 font-mono text-sm text-muted">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-base font-semibold ${
                        hidden ? "text-muted line-through" : ""
                      }`}
                    >
                      {name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                      {hidden && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase">
                          Hidden
                        </span>
                      )}
                      <span className="truncate">{sub}</span>
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center">
                  {"visible" in it && (
                    <button
                      type="button"
                      onClick={() => update(it.id, "visible", hidden)}
                      aria-label={hidden ? "Show" : "Hide"}
                      title={hidden ? "Show on site" : "Hide from site"}
                      className={iconBtn}
                    >
                      {hidden ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  )}
                  {canMove && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Move up"
                        className={iconBtn}
                      >
                        <ArrowUp size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        aria-label="Move down"
                        className={iconBtn}
                      >
                        <ArrowDown size={17} />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => duplicate(i)}
                    aria-label="Duplicate"
                    title="Duplicate"
                    className={`${iconBtn} hidden sm:flex`}
                  >
                    <Copy size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Delete"
                    title="Delete"
                    className={`${iconBtn} hover:!text-red-400`}
                  >
                    <Trash2 size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : it.id)}
                    aria-label="Expand"
                    className={iconBtn}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/10 p-5 sm:p-7">
                      <FieldGrid
                        fields={fields}
                        values={it}
                        onChange={(k, v) => update(it.id, k, v)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
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