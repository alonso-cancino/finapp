import { getMembers, CATEGORIES, categoryLabel } from "../config";

export default function ExpenseForm({ form, updateField, onSubmit, submitting }) {
  const members = getMembers();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quien</label>
        <select
          value={form.who}
          onChange={(e) => updateField("who", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
        >
          <option value="">Seleccionar...</option>
          {members.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
        <input
          type="number"
          inputMode="numeric"
          step="1"
          min="0"
          value={form.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          placeholder="0"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
        >
          <option value="">Seleccionar...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{categoryLabel(c)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Opcional"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg text-base font-medium disabled:opacity-50 active:bg-indigo-700"
      >
        {submitting ? "Guardando..." : "Registrar Gasto"}
      </button>
    </form>
  );
}
