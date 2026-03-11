import { useState } from "react";
import { setToken, apiUrl } from "../config";

export default function TokenGate({ onAuth }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setChecking(true);

    try {
      const url = apiUrl({ action: "getMembers" }, password);
      const res = await fetch(url);
      const json = await res.json();

      if (json.error) {
        setError("Contrasena incorrecta");
        setChecking(false);
        return;
      }

      setToken(password);
      onAuth(password);
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">Ingresa la contrasena</h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasena"
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={checking || !password}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-base font-medium active:bg-indigo-700 disabled:opacity-50"
        >
          {checking ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
