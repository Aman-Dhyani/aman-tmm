"use client";
import React from "react";

interface PricingInputProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingInput: React.FC<PricingInputProps> = ({ label, name, value, onChange}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input type="number" name={name} value={value} placeholder="-" onChange={onChange}
        className="py-[10px] px-[12px] w-[100%] font-medium rounded-[8px] 
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
};

export default PricingInput;
