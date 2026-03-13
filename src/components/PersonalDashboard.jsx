import { useState } from "react";
import { getMembers, formatAmount, personColor, categoryLabel, CATEGORIES, CATEGORY_LABELS } from "../config";

export default function PersonalDashboard({ data }) {
  const members = getMembers();
  const [selected, setSelected] = useState(members[0] || "");

  const { summary = {}, income = {}, personalExpenses = {}, savings = {}, transfers = {}, fairness = {}, byCategoryPerPerson = {}, expenses = [] } = data;

  const myIncome = income[selected] || 0;
  const myShared = summary[selected] || 0;
  const myPersonal = personalExpenses[selected] || 0;
  const mySavings = savings[selected] || 0;
  const myTransfers = transfers[selected] || 0;
  const myFairness = fairness[selected];
  const myCategories = byCategoryPerPerson[selected] || {};

  const totalExpenses = myShared + myPersonal;
  const netBalance = myIncome - totalExpenses - (mySavings > 0 ? mySavings : 0) + myTransfers;

  // Personal expenses by category from the movement list
  const personalByCategory = {};
  (expenses || []).forEach((e) => {
    if (e.who === selected && e.type === "expense" && e.shared === "personal" && e.category) {
      personalByCategory[e.category] = (personalByCategory[e.category] || 0) + e.amount;
    }
  });

  // All spending by category (shared + personal)
  const allMyCategories = { ...myCategories };
  Object.entries(personalByCategory).forEach(([cat, amt]) => {
    allMyCategories[cat] = (allMyCategories[cat] || 0) + amt;
  });
  const allCatEntries = Object.entries(allMyCategories).sort((a, b) => b[1] - a[1]);
  const maxCat = allCatEntries.length ? allCatEntries[0][1] : 0;

  const personIdx = members.indexOf(selected);

  return (
    <div className="space-y-6">
      {/* Person selector */}
      <div className="flex gap-2">
        {members.map((person, i) => (
          <button
            key={person}
            onClick={() => setSelected(person)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
              selected === person
                ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            {person}
          </button>
        ))}
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: personColor(personIdx) }} />
          <span className="font-semibold text-gray-800">{selected}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <SummaryRow label="Ingresos" value={myIncome} color="text-green-600" />
          <SummaryRow label="Gastos Compartidos" value={myShared} color="text-red-500" />
          <SummaryRow label="Gastos Personales" value={myPersonal} color="text-orange-500" />
          <SummaryRow label="Ahorros" value={mySavings} color="text-yellow-600" />
          {myTransfers !== 0 && (
            <SummaryRow
              label="Transferencias"
              value={myTransfers}
              color={myTransfers >= 0 ? "text-blue-600" : "text-blue-500"}
              signed
            />
          )}
        </div>
      </div>

      {/* Fair share */}
      {myFairness && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Mi Contribucion Compartida</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">He pagado</span>
              <span className="font-medium">{formatAmount(myFairness.actualPaid)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Deberia pagar</span>
              <span className="font-medium">{formatAmount(myFairness.shouldPay)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">Balance</span>
              <span className={`font-semibold ${myFairness.balance > 0 ? "text-green-600" : myFairness.balance < 0 ? "text-red-500" : "text-gray-500"}`}>
                {myFairness.balance > 0 ? `+${formatAmount(myFairness.balance)}` : myFairness.balance < 0 ? `-${formatAmount(Math.abs(myFairness.balance))}` : "Justo"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Personal expenses breakdown */}
      {Object.keys(personalByCategory).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Gastos Personales por Categoria</h3>
          <CategoryBars entries={Object.entries(personalByCategory).sort((a, b) => b[1] - a[1])} color={personColor(personIdx)} />
        </div>
      )}

      {/* All my spending by category */}
      {allCatEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Todo mi Gasto por Categoria</h3>
          <CategoryBars entries={allCatEntries} color={personColor(personIdx)} />
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, color, signed }) {
  if (value === 0 && !signed) return null;
  const display = signed
    ? (value >= 0 ? `+${formatAmount(value)}` : `-${formatAmount(Math.abs(value))}`)
    : formatAmount(value);
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className={`font-semibold text-lg ${color}`}>{display}</div>
    </div>
  );
}

function CategoryBars({ entries, color }) {
  const max = entries.length ? entries[0][1] : 0;
  return (
    <div className="space-y-2">
      {entries.map(([cat, amount]) => (
        <div key={cat}>
          <div className="flex justify-between text-sm mb-0.5">
            <span>{categoryLabel(cat)}</span>
            <span className="font-medium">{formatAmount(amount)}</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${max > 0 ? (amount / max) * 100 : 0}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
