import { useState } from "react";
import { useExpenseForm } from "./hooks/useExpenseForm";
import ExpenseForm from "./components/ExpenseForm";
import RecentSubmissions from "./components/RecentSubmissions";
import Dashboard from "./components/Dashboard";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";

export default function App() {
  const [activeTab, setActiveTab] = useState("log");
  const { form, updateField, submit, submitting, toast, dismissToast, recent } = useExpenseForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className="max-w-md mx-auto px-4 pt-6 pb-20">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {activeTab === "log" ? "Log Expense" : "Dashboard"}
        </h1>

        {activeTab === "log" && (
          <>
            <ExpenseForm
              form={form}
              updateField={updateField}
              onSubmit={submit}
              submitting={submitting}
            />
            <RecentSubmissions recent={recent} />
          </>
        )}

        {activeTab === "dashboard" && <Dashboard />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
