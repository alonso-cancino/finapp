export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

const TOKEN_KEY = "apiToken";
const MEMBERS_KEY = "familyMembers";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function apiUrl(params = {}, tokenOverride) {
  const url = new URL(SCRIPT_URL);
  const token = tokenOverride || getToken();
  if (token) url.searchParams.set("token", token);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

export function getMembers() {
  try {
    const stored = JSON.parse(localStorage.getItem(MEMBERS_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return [];
}

export async function fetchMembers() {
  try {
    const res = await fetch(apiUrl({ action: "getMembers" }));
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
    await fetch(apiUrl(), {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setMembers", members }),
    });
  } catch {}
}

export const CATEGORIES = [
  "Food",
  "Transport",
  "Supermarket",
  "Health",
  "Entertainment",
  "Home",
  "Other",
];

export const CATEGORY_LABELS = {
  Food: "Comida",
  Transport: "Transporte",
  Supermarket: "Supermercado",
  Health: "Salud",
  Entertainment: "Entretencion",
  Home: "Hogar",
  Other: "Otro",
};

export function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key;
}

export function formatAmount(n) {
  return "$" + Math.round(Number(n)).toLocaleString("es-CL");
}

// Generate distinct HSL colors for any number of items
const PERSON_HUES = [235, 340, 40, 160, 280, 20];
const CATEGORY_HUES = [210, 150, 30, 350, 270, 90, 180];

export function personColor(index) {
  const h = PERSON_HUES[index % PERSON_HUES.length];
  return `hsl(${h}, 65%, 50%)`;
}

export function categoryColor(index) {
  const h = CATEGORY_HUES[index % CATEGORY_HUES.length];
  return `hsl(${h}, 55%, 50%)`;
}
