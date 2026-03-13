import {
  getMembers,
  CATEGORIES,
  categoryLabel,
  MOVEMENT_TYPES,
  MOVEMENT_LABELS,
  INCOME_CATEGORIES,
  incomeCategoryLabel,
} from "../config";

const TYPE_COLORS = {
  expense: "bg-red-100 text-red-700 border-red-300",
  income: "bg-green-100 text-green-700 border-green-300",
  transfer: "bg-blue-100 text-blue-700 border-blue-300",
  savings: "bg-yellow-100 text-yellow-700 border-yellow-300",
  withdrawal: "bg-orange-100 text-orange-700 border-orange-300",
};

const SUBMIT_LABELS = {
  expense: "Registrar Gasto",
  income: "Registrar Ingreso",
  transfer: "Registrar Transferencia",
  savings: "Registrar Ahorro",
  withdrawal: "Registrar Retiro",
};

export default function MovementForm({ form, updateField, onSubmit, submitting }) {
  const members = getMembers();
  const { type } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const showCategory = type === "expense";
  const showIncomeCategory = type === "income";
  const showShared = type === "expense";
  const showTo = type === "transfer";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {MOVEMENT_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => updateField("type", t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
              type === t ? TYPE_COLORS[t] : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {MOVEMENT_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Who */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {showTo ? "De" : "Quien"}
        </label>
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

      {/* To (transfers only) */}
      {showTo && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
          <select
            value={form.to}
            onChange={(e) => updateField("to", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
          >
            <option value="">Seleccionar...</option>
            {members.filter((m) => m !== form.who).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {/* Amount */}
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

      {/* Expense category */}
      {showCategory && (
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
      )}

      {/* Income category */}
      {showIncomeCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ingreso</label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
          >
            <option value="">Seleccionar...</option>
            {INCOME_CATEGORIES.map((c) => (
              <option key={c} value={c}>{incomeCategoryLabel(c)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Shared/Personal toggle (expenses only) */}
      {showShared && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de gasto</label>
          <div className="flex gap-2">
            {[
              { value: "shared", label: "Compartido" },
              { value: "personal", label: "Personal" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateField("shared", value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.shared === value
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
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

      {/* Date */}
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
        {submitting ? "Guardando..." : SUBMIT_LABELS[type]}
      </button>
    </form>
  );
}
