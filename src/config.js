const MEMBERS_KEY = "familyMembers";

export function getMembers() {
  try {
    const stored = JSON.parse(localStorage.getItem(MEMBERS_KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return [];
}

export function setMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
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

export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
