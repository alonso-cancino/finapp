import { useState } from "react";
import { getMembers } from "../config";

export default function CategoryBreakdown({ byCategory, byCategoryPerPerson }) {
  const filters = ["All", ...getMembers()];
  const [filter, setFilter] = useState("All");

  if (!byCategory) return null;

  const data = filter === "All"
    ? byCategory
    : (byCategoryPerPerson?.[filter] || {});

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {entries.map(([cat, amount]) => (
          <div key={cat}>
            <div className="flex justify-between text-sm mb-0.5">
              <span>{cat}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: max > 0 ? `${(amount / max) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No data for this month</p>
        )}
      </div>
    </div>
  );
}
