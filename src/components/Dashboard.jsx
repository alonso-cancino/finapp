import { useDashboardData } from "../hooks/useDashboardData";
import SpendingSummary from "./SpendingSummary";
import CategoryBreakdown from "./CategoryBreakdown";

export default function Dashboard() {
  const { month, data, loading, error, prevMonth, nextMonth } = useDashboardData();

  const label = new Date(month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 text-xl text-gray-600 active:text-indigo-600">&larr;</button>
        <h2 className="text-base font-semibold">{label}</h2>
        <button onClick={nextMonth} className="p-2 text-xl text-gray-600 active:text-indigo-600">&rarr;</button>
      </div>

      {loading && <p className="text-center text-gray-400 py-8">Loading...</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {data && !loading && (
        <>
          <SpendingSummary summary={data.summary} />
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">By Category</h3>
            <CategoryBreakdown
              byCategory={data.byCategory}
              byCategoryPerPerson={data.byCategoryPerPerson}
            />
          </div>
          {data.expenses?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Expenses</h3>
              <div className="space-y-2">
                {data.expenses.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-sm border border-gray-100">
                    <div>
                      <span className="font-medium">{item.who}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-gray-600">{item.category}</span>
                      {item.description && <span className="text-gray-400 ml-1">({item.description})</span>}
                      <span className="text-gray-300 ml-1 text-xs">{item.date}</span>
                    </div>
                    <span className="font-medium">${Number(item.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
