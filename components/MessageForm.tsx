"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData { name: string; message: string; }
interface FormErrors { name?: string; message?: string; }
type Status = "idle" | "loading" | "success" | "error";

function FloatingInput({
  id, label, value, onChange, error, multiline,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; error?: string; multiline?: boolean;
}) {
  return (
    <div className="input-group">
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder=" " rows={5} className="resize-none"
          aria-describedby={error ? `${id}-error` : undefined} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder=" " aria-describedby={error ? `${id}-error` : undefined} />
      )}
      <label htmlFor={id}>{label}</label>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} className="text-red-400 text-xs mt-1 ml-1"
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }} role="alert">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MessageForm() {
  const [form, setForm] = useState<FormData>({ name: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Đạo hiệu của bạn là gì?";
    if (form.message.trim().length < 5) e.message = "Lời nhắn phải có ít nhất 5 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      if (toastRef.current) clearTimeout(toastRef.current);
      toastRef.current = setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section className="section relative z-10 px-6" aria-label="Form gửi lời nhắn">
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-jade/40 text-xs tracking-widest uppercase mb-2">☯ Truyền Âm Phù ☯</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer">
            Nhắn Tin Đạo Hữu
          </h2>
          <p className="text-white/30 text-sm mt-2">Mọi lời nhắn đều được đọc kỹ và hồi âm</p>
        </motion.div>

        <motion.div className="glass rounded-3xl p-8 md:p-10"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <FloatingInput id="name" label="Đạo hiệu của bạn"
              value={form.name}
              onChange={(v) => { setForm((f) => ({ ...f, name: v })); if (errors.name) setErrors((e) => ({ ...e, name: undefined })); }}
              error={errors.name} />

            <FloatingInput id="message" label="Lời nhắn tới đạo hữu"
              value={form.message}
              onChange={(v) => { setForm((f) => ({ ...f, message: v })); if (errors.message) setErrors((e) => ({ ...e, message: undefined })); }}
              error={errors.message} multiline />

            <motion.button type="submit" disabled={status === "loading"}
              className="relative w-full py-4 rounded-xl font-semibold text-ink overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #00C896, #7FFFD4)" }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              aria-label="Gửi lời nhắn">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <AnimatePresence mode="wait">
                {status === "loading" ? (
                  <motion.div key="loading" className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang truyền âm...
                  </motion.div>
                ) : status === "success" ? (
                  <motion.div key="success" className="flex items-center justify-center gap-2"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }} />
                    </motion.svg>
                    Âm phù đã gửi!
                  </motion.div>
                ) : (
                  <motion.span key="idle" className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span>📜</span> Gửi Truyền Âm Phù
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-medium text-sm shadow-lg ${status === "success" ? "bg-jade/90 text-ink" : "bg-red-500/90 text-white"}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            role="status" aria-live="polite">
            {status === "success" ? "☯ Âm phù truyền thành công!" : "❌ Lỗi truyền âm, thử lại sau"}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
