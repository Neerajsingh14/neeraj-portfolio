"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

type Kind = "ok" | "err";
type ToastItem = { id: number; kind: Kind; text: string };

type Ctx = {
  toast: (kind: Kind, text: string) => void;
  setDirty: (v: boolean) => void;
  confirmLeave: () => boolean;
};

const AdminCtx = createContext<Ctx | null>(null);

export function useAdmin() {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdmin must be used inside AdminProvider");
  return v;
}

// editor ke unsaved changes ka track (page chhodte waqt warning)
export function useDirtyGuard(dirty: boolean) {
  const { setDirty } = useAdmin();

  useEffect(() => {
    setDirty(dirty);
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, setDirty]);

  useEffect(() => () => setDirty(false), [setDirty]);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dirtyRef = useRef(false);
  const idRef = useRef(0);

  const toast = useCallback((kind: Kind, text: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      kind === "err" ? 5500 : 3000
    );
  }, []);

  const setDirty = useCallback((v: boolean) => {
    dirtyRef.current = v;
  }, []);

  const confirmLeave = useCallback(
    () =>
      !dirtyRef.current ||
      window.confirm("Unsaved changes hain. Page chhod kar jaana hai?"),
    []
  );

  const value = useMemo(
    () => ({ toast, setDirty, confirmLeave }),
    [toast, setDirty, confirmLeave]
  );

  return (
    <AdminCtx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-surface p-4 shadow-2xl shadow-black/50 ${
                t.kind === "ok" ? "border-green-400/30" : "border-red-400/40"
              }`}
            >
              {t.kind === "ok" ? (
                <CircleCheck size={20} className="mt-0.5 shrink-0 text-green-400" />
              ) : (
                <CircleAlert size={20} className="mt-0.5 shrink-0 text-red-400" />
              )}
              <p className="min-w-0 flex-1 text-sm leading-relaxed">{t.text}</p>
              <button
                onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
                aria-label="Dismiss"
                className="text-muted transition hover:text-fg"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminCtx.Provider>
  );
}