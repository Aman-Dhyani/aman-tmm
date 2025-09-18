"use client";
import { useRouter } from "next/navigation";
import React from "react";

type DefCardProps = {
  heading: string;
  subheading: string;
  buttonText?: string;
  buttonRedirect?: string;
  borderColor: string;
  bgColor: string;
  buttonColor?: string;
  extraButtons?: { text: string; color?: string }[];
};

export default function DefCard({ heading, subheading, buttonText, buttonRedirect = "", borderColor, bgColor, buttonColor, extraButtons,}: DefCardProps) {
  const router = useRouter();

  const handleRedirect = (url: string) => {
    if (!url) return;
    router.push(url); // navigate immediately, no blocking
  };

  return (
    <div className={`rounded-lg p-6 border sd-full-shadow h-[200px] flex flex-col justify-between ${borderColor} ${bgColor} bg-transparent`}>
      {/* Top content */}
      <div>
        <h3 className="text-lg font-bold text-black dark:text-white">{heading}</h3>
        <p className="text-gray-600 dark:text-gray-300">{subheading}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap">
        {extraButtons
          ? extraButtons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleRedirect(buttonRedirect)}
                className={`py-[4px] px-[12px] min-w-[120px] font-medium rounded-[16px] shadow-md cursor-pointer border border-transparent ${
                  btn.color || "bg-[#44b5562e] text-black"
                }`}>
                {btn.text}
              </button>
            ))
          : buttonText && (
              <button
                onClick={() => handleRedirect(buttonRedirect)}
                className={`self-start py-[4px] px-[12px] min-w-[120px] font-medium rounded-[16px] shadow-md cursor-pointer border border-transparent ${
                  buttonColor || "bg-[#44b5562e] text-black"
                } transform transition-transform active:scale-95 active:shadow-sm`}
              >
                {buttonText}
              </button>
            )}
      </div>
    </div>
  );
}
