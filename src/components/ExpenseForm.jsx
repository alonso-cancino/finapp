import { getMembers, CATEGORIES } from "../config";

export default function ExpenseForm({ form, updateField, onSubmit, submitting }) {
  const members = getMembers();
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Who</label>
        <select
          value={form.who}
          onChange={(e) => updateField("who", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
        >
          <option value="">Select...</option>
          {members.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={form.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          placeholder="0.00"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
        >
          <option value="">Select...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Optional"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
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
        {submitting ? "Saving..." : "Log Expense"}
      </button>
    </form>
  );
}
