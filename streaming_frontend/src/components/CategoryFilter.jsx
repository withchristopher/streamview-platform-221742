import { useMemo } from "react";

// PUBLIC_INTERFACE
export default function CategoryFilter({ value, onChange, categories = [] }) {
  const items = useMemo(() => {
    const base = [{ id: "", name: "All" }];
    return base.concat(
      (categories || []).map((c) =>
        typeof c === "string" ? { id: c, name: c } : c
      )
    );
  }, [categories]);

  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full md:w-56 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    >
      {items.map((c) => (
        <option key={c.id || c.name} value={c.id ?? c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
