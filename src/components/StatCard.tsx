import Image from "next/image";
import React from "react";

interface StatCardProps {
  title: string;
  value?: string | number;
  label?: string;
  className?: string;
  imgData?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, label, className = "", imgData,}) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-md sd-full-shadow min-h-[120px] flex flex-wrap justify-between items-center gap-4 ${className}`}>
      {/* Text */}
      <div className="flex flex-col justify-center flex-1 min-w-[150px]">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-2xl font-bold">{value}</p>
        {label && <span className="text-xs text-[#1e3a8a]">{label}</span>}
      </div>

      {/* Image */}
      {imgData && (
        <div className="flex-shrink-0 w-[60px] h-[60px]">
          <Image src={imgData} alt="Stat Card Image" width={60} height={60} className="object-contain" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
