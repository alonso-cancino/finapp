import { useState, useEffect } from "react";
import { getMembers, fetchMembers, saveMembers, clearToken } from "../config";

export default function Settings({ onMembersChange }) {
  const [members, setLocal] = useState(getMembers);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers().then((m) => {
      setLocal(m);
      setLoading(false);
    });
  }, []);

  const update = (updated) => {
    setLocal(updated);
    saveMembers(updated);
    onMembersChange(updated);
  };

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed || members.includes(trimmed)) return;
    update([...members, trimmed]);
    setName("");
  };

  const remove = (member) => {
    update(members.filter((m) => m !== member));
  };

  const logout = () => {
    clearToken();
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Miembros de la Familia</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Nombre"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-3 text-base"
          />
          <button
            onClick={add}
            className="bg-indigo-600 text-white px-4 rounded-lg text-base font-medium active:bg-indigo-700"
          >
            Agregar
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-4">Cargando...</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member} className="flex justify-between items-center bg-white rounded-lg px-3 py-3 border border-gray-100">
              <span className="font-medium">{member}</span>
              <button
                onClick={() => remove(member)}
                className="text-red-500 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Agrega miembros para comenzar</p>
          )}
        </div>
      )}

      <hr className="border-gray-200" />

      <button
        onClick={logout}
        className="w-full text-red-600 text-sm font-medium py-3 rounded-lg border border-red-200 active:bg-red-50"
      >
        Cerrar sesion
      </button>
    </div>
  );
}
