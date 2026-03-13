import { getMembers, formatAmount, personColor, categoryLabel } from "../config";
import SpendingSummary from "./SpendingSummary";
import TotalBreakdown from "./TotalBreakdown";
import CategoryBreakdown from "./CategoryBreakdown";

export default function GeneralDashboard({ data }) {
  const members = getMembers();
  const { summary = {}, byCategory = {}, byCategoryPerPerson = {}, income = {}, personalExpenses = {}, savings = {}, fairness = {}, expenses = [] } = data;

  const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);
  const totalShared = Object.values(summary).reduce((a, b) => a + b, 0);
  const totalPersonal = Object.values(personalExpenses).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Income cards */}
      {totalIncome > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ingresos</h3>
          <div className="flex gap-3">
            {members.map((person, i) => (
              <div key={person} className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: personColor(i) }} />
                  <span className="text-xs text-gray-500">{person}</span>
                </div>
                <div className="text-lg font-semibold text-green-600">{formatAmount(income[person] || 0)}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">Total: {formatAmount(totalIncome)}</div>
        </div>
      )}

      {/* Spending overview */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Gastos Compartidos</h3>
        <SpendingSummary summary={summary} />
      </div>

      {totalPersonal > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Gastos Personales</h3>
          <div className="flex gap-3">
            {members.map((person, i) => {
              const amt = personalExpenses[person] || 0;
              if (amt <= 0) return null;
              return (
                <div key={person} className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: personColor(i) }} />
                    <span className="text-xs text-gray-500">{person}</span>
                  </div>
                  <div className="text-lg font-semibold">{formatAmount(amt)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fairness widget */}
      {Object.keys(fairness).length > 0 && totalShared > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Equidad</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-3">
            {members.map((person, i) => {
              const f = fairness[person];
              if (!f) return null;
              const { actualPaid, shouldPay, balance } = f;
              const maxVal = Math.max(actualPaid, shouldPay) || 1;
              return (
                <div key={person}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: personColor(i) }} />
                      <span className="font-medium">{person}</span>
                    </div>
                    <span className={`text-xs font-medium ${balance > 0 ? "text-green-600" : balance < 0 ? "text-red-500" : "text-gray-500"}`}>
                      {balance > 0 ? `+${formatAmount(balance)}` : balance < 0 ? `-${formatAmount(Math.abs(balance))}` : "Justo"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-14">Pago</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(actualPaid / maxVal) * 100}%`, backgroundColor: personColor(i) }}
                        />
                      </div>
                      <span className="w-20 text-right">{formatAmount(actualPaid)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-14">Deberia</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gray-400"
                          style={{ width: `${(shouldPay / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-right">{formatAmount(shouldPay)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category breakdowns */}
      {Object.keys(byCategory).length > 0 && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Distribucion Total</h3>
            <TotalBreakdown
              byCategory={byCategory}
              byCategoryPerPerson={byCategoryPerPerson}
              total={totalShared}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Por Categoria</h3>
            <CategoryBreakdown
              byCategory={byCategory}
              byCategoryPerPerson={byCategoryPerPerson}
            />
          </div>
        </>
      )}

      {/* Savings */}
      {Object.values(savings).some((v) => v !== 0) && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ahorros</h3>
          <div className="flex gap-3">
            {members.map((person, i) => {
              const net = savings[person] || 0;
              if (net === 0) return null;
              return (
                <div key={person} className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: personColor(i) }} />
                    <span className="text-xs text-gray-500">{person}</span>
                  </div>
                  <div className={`text-lg font-semibold ${net >= 0 ? "text-yellow-600" : "text-red-500"}`}>
                    {formatAmount(net)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent movements */}
      {expenses.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Movimientos Recientes</h3>
          <MovementList expenses={expenses} />
        </div>
      )}
    </div>
  );
}

function MovementList({ expenses }) {
  return (
    <div className="space-y-2">
      {expenses.map((item, i) => {
        const isTransfer = item.type === "transfer";
        return (
          <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-sm border border-gray-100">
            <div className="min-w-0">
              <TypeBadge type={item.type} shared={item.shared} />
              <span className="font-medium ml-1">
                {isTransfer ? `${item.who} → ${item.to}` : item.who}
              </span>
              {!isTransfer && item.category && (
                <>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-gray-600">{categoryLabel(item.category)}</span>
                </>
              )}
              {item.description && <span className="text-gray-400 ml-1">({item.description})</span>}
              <span className="text-gray-300 ml-1 text-xs">{item.date}</span>
            </div>
            <span className="font-medium flex-shrink-0 ml-2">{formatAmount(item.amount)}</span>
          </div>
        );
      })}
    </div>
  );
}

const BADGE_COLORS = {
  expense: "bg-red-100 text-red-600",
  income: "bg-green-100 text-green-600",
  transfer: "bg-blue-100 text-blue-600",
  savings: "bg-yellow-100 text-yellow-600",
  withdrawal: "bg-orange-100 text-orange-600",
};

const BADGE_LABELS = {
  expense: "G",
  income: "I",
  transfer: "T",
  savings: "A",
  withdrawal: "R",
};

function TypeBadge({ type, shared }) {
  const color = BADGE_COLORS[type] || "bg-gray-100 text-gray-600";
  let label = BADGE_LABELS[type] || "?";
  if (type === "expense" && shared === "personal") label = "GP";
  return (
    <span className={`inline-block text-[10px] font-bold rounded px-1 py-0.5 ${color}`}>
      {label}
    </span>
  );
}
