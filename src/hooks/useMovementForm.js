import { useState, useCallback } from "react";
import { apiUrl, MOVEMENT_LABELS } from "../config";

const STORAGE_KEY = "recentExpenses";

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadRecent() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Gracefully handle old entries that lack type field
    return stored.map((e) => ({ type: "expense", shared: "shared", to: "", ...e }));
  } catch {
    return [];
  }
}

function saveRecent(entry) {
  const recent = [entry, ...loadRecent()].slice(0, 3);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  return recent;
}

const initialForm = (who) => ({
  type: "expense",
  who: who || "",
  amount: "",
  category: "",
  description: "",
  date: getToday(),
  shared: "shared",
  to: "",
});

export function useMovementForm() {
  const [form, setForm] = useState(() => initialForm());
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [recent, setRecent] = useState(loadRecent);

  const updateField = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Reset type-specific fields when changing type
      if (field === "type") {
        next.category = "";
        next.shared = "shared";
        next.to = "";
      }
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    const { type, who, amount, category, to } = form;

    // Common validation
    if (!who || !amount) {
      setToast({ type: "error", message: "Completa los campos requeridos" });
      return;
    }

    // Type-specific validation
    if (type === "expense" && !category) {
      setToast({ type: "error", message: "Selecciona una categoria" });
      return;
    }
    if (type === "income" && !category) {
      setToast({ type: "error", message: "Selecciona una categoria de ingreso" });
      return;
    }
    if (type === "transfer" && !to) {
      setToast({ type: "error", message: "Selecciona a quien transferir" });
      return;
    }

    setSubmitting(true);
    const payload = { ...form, amount: parseFloat(amount) };

    try {
      await fetch(apiUrl(), {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updated = saveRecent(payload);
      setRecent(updated);

      const label = MOVEMENT_LABELS[type] || "Movimiento";
      setToast({ type: "success", message: `${label} guardado!` });
      setForm(initialForm(who));
    } catch {
      setToast({ type: "error", message: "Error de red. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const dismissToast = useCallback(() => setToast(null), []);

  return { form, updateField, submit, submitting, toast, dismissToast, recent };
}
