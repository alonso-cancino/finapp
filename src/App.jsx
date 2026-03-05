import { useState } from "react";
import { useExpenseForm } from "./hooks/useExpenseForm";
import ExpenseForm from "./components/ExpenseForm";
import RecentSubmissions from "./components/RecentSubmissions";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import { getMembers } from "./config";

export default function App() {
  const [activeTab, setActiveTab] = useState(() => getMembers().length ? "log" : "settings");
  const [, setMembersVersion] = useState(0);
  const { form, updateField, submit, submitting, toast, dismissToast, recent } = useExpenseForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className="max-w-md mx-auto px-4 pt-6 pb-20">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {activeTab === "log" ? "Log Expense" : activeTab === "dashboard" ? "Dashboard" : "Settings"}
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

        {activeTab === "settings" && (
          <Settings onMembersChange={() => setMembersVersion((v) => v + 1)} />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
