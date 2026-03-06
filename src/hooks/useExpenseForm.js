import { useState, useCallback } from "react";
import { SCRIPT_URL } from "../config";

const STORAGE_KEY = "recentExpenses";

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecent(expense) {
  const recent = [expense, ...loadRecent()].slice(0, 3);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  return recent;
}

const initialForm = (who) => ({
  who: who || "",
  amount: "",
  category: "",
  description: "",
  date: getToday(),
});

export function useExpenseForm() {
  const [form, setForm] = useState(() => initialForm());
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [recent, setRecent] = useState(loadRecent);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submit = useCallback(async () => {
    if (!form.who || !form.amount || !form.category) {
      setToast({ type: "error", message: "Completa los campos requeridos" });
      return;
    }

    setSubmitting(true);
    const payload = { ...form, amount: parseFloat(form.amount) };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updated = saveRecent(payload);
      setRecent(updated);
      setToast({ type: "success", message: "Gasto guardado!" });
      setForm(initialForm(form.who));
    } catch {
      setToast({ type: "error", message: "Error de red. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const dismissToast = useCallback(() => setToast(null), []);

  return { form, updateField, submit, submitting, toast, dismissToast, recent };
}
