import { getMembers, categoryLabel, formatAmount, categoryColor, personColor } from "../config";

export default function TotalBreakdown({ byCategory, byCategoryPerPerson, total }) {
  if (!byCategory || total <= 0) return null;

  const members = getMembers();
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      <div className="flex rounded-lg overflow-hidden h-6">
        {entries.map(([cat, amount], i) => {
          const pct = (amount / total) * 100;
          return pct > 0 ? (
            <div
              key={cat}
              className="h-full flex items-center justify-center text-white text-[10px] font-medium overflow-hidden"
              style={{ width: `${pct}%`, backgroundColor: categoryColor(i) }}
            >
              {pct > 8 ? `${Math.round(pct)}%` : ""}
            </div>
          ) : null;
        })}
      </div>
      <div className="space-y-2">
        {entries.map(([cat, amount], i) => {
          const pct = Math.round((amount / total) * 100);
          return (
            <div key={cat} className="bg-white rounded-lg p-2.5 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded"
                    style={{ backgroundColor: categoryColor(i) }}
                  />
                  <span className="text-sm font-medium">{categoryLabel(cat)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{formatAmount(amount)}</span>
                  <span className="text-gray-400 ml-1">({pct}%)</span>
                </div>
              </div>
              <div className="flex rounded-full overflow-hidden h-1.5">
                {members.map((person, pi) => {
                  const personAmount = byCategoryPerPerson?.[person]?.[cat] || 0;
                  if (personAmount <= 0) return null;
                  const personPct = (personAmount / amount) * 100;
                  return (
                    <div
                      key={person}
                      className="h-full"
                      style={{ width: `${personPct}%`, backgroundColor: personColor(pi) }}
                    />
                  );
                })}
              </div>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                {members.map((person, pi) => {
                  const personAmount = byCategoryPerPerson?.[person]?.[cat] || 0;
                  if (personAmount <= 0) return null;
                  return (
                    <span key={person}>
                      {person}: {formatAmount(personAmount)}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
