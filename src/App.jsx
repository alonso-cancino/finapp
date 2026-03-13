import { useState, useEffect } from "react";
import { useMovementForm } from "./hooks/useMovementForm";
import MovementForm from "./components/MovementForm";
import RecentSubmissions from "./components/RecentSubmissions";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import TokenGate from "./components/TokenGate";
import { getMembers, fetchMembers, getToken, MOVEMENT_LABELS } from "./config";

export default function App() {
  const [token, setToken] = useState(getToken);

  if (!token) {
    return <TokenGate onAuth={setToken} />;
  }

  return <MainApp />;
}

function MainApp() {
  const [activeTab, setActiveTab] = useState(() => getMembers().length ? "log" : "settings");
  const [, setMembersVersion] = useState(0);

  useEffect(() => {
    fetchMembers().then(() => setMembersVersion((v) => v + 1));
  }, []);
  const { form, updateField, submit, submitting, toast, dismissToast, recent } = useMovementForm();

  const logTitle = MOVEMENT_LABELS[form.type]
    ? `Registrar ${MOVEMENT_LABELS[form.type]}`
    : "Registrar Movimiento";

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className="max-w-md mx-auto px-4 pt-6 pb-20">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {activeTab === "log" ? logTitle : activeTab === "dashboard" ? "Resumen" : "Ajustes"}
        </h1>

        {activeTab === "log" && (
          <>
            <MovementForm
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
