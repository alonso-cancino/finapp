import { categoryLabel, formatAmount } from "../config";

export default function RecentSubmissions({ recent }) {
  if (!recent.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Recientes</h3>
      <div className="space-y-2">
        {recent.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <div>
              <span className="font-medium">{item.who}</span>
              <span className="text-gray-400 mx-1">-</span>
              <span className="text-gray-600">{categoryLabel(item.category)}</span>
              {item.description && <span className="text-gray-400 ml-1">({item.description})</span>}
            </div>
            <span className="font-medium">{formatAmount(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
