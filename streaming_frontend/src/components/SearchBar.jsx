import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = "Search" }) {
  return (
    <div className="relative w-full">
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}
