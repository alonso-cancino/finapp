import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "../config";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(m, delta) {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function useDashboardData() {
  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (m) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl({ month: m }));
      const json = await res.json();
      setData(json);
    } catch {
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(month);
  }, [month, fetchData]);

  const prevMonth = useCallback(() => {
    setMonth((m) => shiftMonth(m, -1));
  }, []);

  const nextMonth = useCallback(() => {
    setMonth((m) => shiftMonth(m, 1));
  }, []);

  return { month, data, loading, error, prevMonth, nextMonth, refetch: () => fetchData(month) };
}
