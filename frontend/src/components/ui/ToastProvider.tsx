"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = `${variant}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item = { id, message, variant };

      setToasts((current) => [item, ...current]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      toast: {
        success: (message: string) => pushToast(message, "success"),
        error: (message: string) => pushToast(message, "error"),
        info: (message: string) => pushToast(message, "info"),
      },
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 sm:right-6">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, variant }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 24, y: -12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 24, y: -12 }}
              className={`pointer-events-auto rounded-3xl border p-4 shadow-lg transition ${
                variant === "success"
                  ? "border-emerald-300/40 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-950 dark:text-emerald-300"
                  : variant === "error"
                    ? "border-rose-300/40 bg-rose-50 text-rose-900 dark:border-rose-500/20 dark:bg-rose-950 dark:text-rose-300"
                    : "border-slate-300/40 bg-slate-50 text-slate-900 dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

// Also export a hook with a simpler name for convenience
export const useToast = useToastContext;
