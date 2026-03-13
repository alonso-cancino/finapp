import { categoryLabel, formatAmount, movementLabel } from "../config";

const TYPE_DOT_COLORS = {
  expense: "bg-red-400",
  income: "bg-green-400",
  transfer: "bg-blue-400",
  savings: "bg-yellow-400",
  withdrawal: "bg-orange-400",
};

export default function RecentSubmissions({ recent }) {
  if (!recent.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Recientes</h3>
      <div className="space-y-2">
        {recent.map((item, i) => {
          const type = item.type || "expense";
          const isTransfer = type === "transfer";
          return (
            <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${TYPE_DOT_COLORS[type] || "bg-gray-400"}`} />
                <div className="min-w-0">
                  <span className="font-medium">
                    {isTransfer ? `${item.who} → ${item.to}` : item.who}
                  </span>
                  {!isTransfer && item.category && (
                    <>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-gray-600">{categoryLabel(item.category)}</span>
                    </>
                  )}
                  {item.description && <span className="text-gray-400 ml-1">({item.description})</span>}
                  <span className="text-gray-300 ml-1 text-xs">{movementLabel(type)}</span>
                </div>
              </div>
              <span className="font-medium flex-shrink-0 ml-2">{formatAmount(item.amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
