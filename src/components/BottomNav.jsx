const tabs = [
  { id: "log", label: "Log", icon: "+" },
  { id: "dashboard", label: "Dashboard", icon: "\u2261" },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex safe-bottom">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 flex flex-col items-center text-xs font-medium ${
            activeTab === tab.id ? "text-indigo-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl leading-none mb-0.5">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
