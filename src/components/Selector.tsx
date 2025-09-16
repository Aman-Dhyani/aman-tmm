"use client";
import React from "react";

interface SelectorProps<T extends string> {
  id: string;
  label?: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  className?: string;
}

// Selector
export default function Selector<T extends string>({ id, label, value, options, onChange, className = "",}: SelectorProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="font-semibold">{label}</span>}

      <label className="sr-only" htmlFor={id}>
        {label || id}
      </label>

      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}
        className={`bg-[#e5e7eb] font-semibold text-sm px-2 py-1 rounded-md focus:outline-none ${className}`}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
