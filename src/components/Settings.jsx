import { useState } from "react";
import { getMembers, setMembers } from "../config";

export default function Settings({ onMembersChange }) {
  const [members, setLocal] = useState(getMembers);
  const [name, setName] = useState("");

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed || members.includes(trimmed)) return;
    const updated = [...members, trimmed];
    setLocal(updated);
    setMembers(updated);
    onMembersChange(updated);
    setName("");
  };

  const remove = (member) => {
    const updated = members.filter((m) => m !== member);
    setLocal(updated);
    setMembers(updated);
    onMembersChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Family Members</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-3 text-base"
          />
          <button
            onClick={add}
            className="bg-indigo-600 text-white px-4 rounded-lg text-base font-medium active:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member} className="flex justify-between items-center bg-white rounded-lg px-3 py-3 border border-gray-100">
            <span className="font-medium">{member}</span>
            <button
              onClick={() => remove(member)}
              className="text-red-500 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Add family members to get started</p>
        )}
      </div>
    </div>
  );
}
