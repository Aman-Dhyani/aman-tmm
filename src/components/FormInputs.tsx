"use client";
import React from "react";

type SingleInputProps = {
  label?: string;
  name: string;
  placeholder?: string;
};

type DoubleInputProps = {
  label: string;
  name: string;
};

// Single Input
function SingleInput({ label, name, placeholder = "Packet",}: SingleInputProps) {
  return (
    <div className="mb-6 w-[100%]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input type="number" name={name} placeholder={placeholder} min={0}
        className="
          py-[10px] px-[12px] w-[100%] font-medium rounded-[8px] 
          border border-gray-300 dark:border-gray-500
          bg-white dark:bg-gray-800
          text-black dark:text-white
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-moz-inner-spin-button]:appearance-none
        "
      />
    </div>
  );
}

// Double Input
function DoubleInput({ label, name }: DoubleInputProps) {
  return (
    <div className="flex gap-4 items-end mb-0">
      <SingleInput name={`${name}_pkt`} placeholder="Packet" label={label} />
      <SingleInput name={`${name}_pcs`} placeholder="Pieces" />
    </div>
  );
}

export { SingleInput, DoubleInput };
