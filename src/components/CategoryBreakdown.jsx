import { getMembers, categoryLabel, formatAmount } from "../config";

const COLORS = ["bg-indigo-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500"];

export default function CategoryBreakdown({ byCategory, byCategoryPerPerson }) {
  if (!byCategory) return null;

  const members = getMembers();
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  return (
    <div>
      <div className="flex gap-2 mb-3 text-xs">
        {members.map((m, i) => (
          <div key={m} className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${COLORS[i]}`} />
            <span className="text-gray-600">{m}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {entries.map(([cat, total]) => (
          <div key={cat}>
            <div className="flex justify-between text-sm mb-0.5">
              <span>{categoryLabel(cat)}</span>
              <span className="font-medium">{formatAmount(total)}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden flex">
              {members.map((person, i) => {
                const personAmount = byCategoryPerPerson?.[person]?.[cat] || 0;
                if (personAmount <= 0 || max <= 0) return null;
                const pct = (personAmount / max) * 100;
                return (
                  <div
                    key={person}
                    className={`${COLORS[i]} h-full`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Sin datos para este mes</p>
        )}
      </div>
    </div>
  );
}
