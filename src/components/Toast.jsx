import { useEffect } from "react";

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bg = toast.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${bg}`}
      onClick={onDismiss}
    >
      {toast.message}
    </div>
  );
}
