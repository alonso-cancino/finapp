export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

const MEMBERS_KEY = "familyMembers";

export function getMembers() {
  try {
    const stored = JSON.parse(localStorage.getItem(MEMBERS_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return [];
}

export async function fetchMembers() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getMembers`);
    const json = await res.json();
    if (Array.isArray(json.members) && json.members.length) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(json.members));
      return json.members;
    }
  } catch {}
  return getMembers();
}

export async function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setMembers", members }),
    });
  } catch {}
}

export const CATEGORIES = [
  "Comida",
  "Transporte",
  "Supermercado",
  "Salud",
  "Entretencion",
  "Hogar",
  "Otro",
];
