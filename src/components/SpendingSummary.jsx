import { getMembers, formatAmount, personColor } from "../config";

export default function SpendingSummary({ summary }) {
  if (!summary) return null;

  const members = getMembers();
  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {members.map((person, i) => (
          <div key={person} className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: personColor(i) }} />
              <span className="text-xs text-gray-500">{person}</span>
            </div>
            <div className="text-lg font-semibold">{formatAmount(summary[person] || 0)}</div>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="flex rounded-full overflow-hidden h-2">
          {members.map((person, i) => {
            const pct = ((summary[person] || 0) / total) * 100;
            return pct > 0 ? (
              <div key={person} style={{ width: `${pct}%`, backgroundColor: personColor(i) }} className="h-full" />
            ) : null;
          })}
        </div>
      )}
      <div className="text-center text-sm text-gray-500">Total: {formatAmount(total)}</div>
    </div>
  );
}
