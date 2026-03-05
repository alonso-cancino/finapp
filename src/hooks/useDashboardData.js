import { useState, useEffect, useCallback } from "react";
import { SCRIPT_URL } from "../config";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
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
      const res = await fetch(`${SCRIPT_URL}?month=${m}`);
      const json = await res.json();
      setData(json);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(month);
  }, [month, fetchData]);

  const prevMonth = useCallback(() => {
    setMonth((m) => {
      const d = new Date(m + "-01");
      d.setMonth(d.getMonth() - 1);
      return d.toISOString().slice(0, 7);
    });
  }, []);

  const nextMonth = useCallback(() => {
    setMonth((m) => {
      const d = new Date(m + "-01");
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().slice(0, 7);
    });
  }, []);

  return { month, data, loading, error, prevMonth, nextMonth, refetch: () => fetchData(month) };
}
