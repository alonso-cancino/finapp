import { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import GeneralDashboard from "./GeneralDashboard";
import PersonalDashboard from "./PersonalDashboard";

export default function Dashboard() {
  const { month, data, loading, error, prevMonth, nextMonth } = useDashboardData();
  const [subTab, setSubTab] = useState("general");

  const [y, m] = month.split("-").map(Number);
  const label = new Date(y, m - 1).toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 text-xl text-gray-600 active:text-indigo-600">&larr;</button>
        <h2 className="text-base font-semibold">{label}</h2>
        <button onClick={nextMonth} className="p-2 text-xl text-gray-600 active:text-indigo-600">&rarr;</button>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "general", label: "General" },
          { key: "personal", label: "Personal" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              subTab === key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400 py-8">Cargando...</p>}
      {error && <p className="text-center text-red-500 py-8">{error}</p>}

      {data && !loading && (
        <>
          {subTab === "general" && <GeneralDashboard data={data} />}
          {subTab === "personal" && <PersonalDashboard data={data} />}
        </>
      )}
    </div>
  );
}
