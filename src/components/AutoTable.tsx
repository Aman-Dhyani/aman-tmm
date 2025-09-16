"use client";
import React from "react";

interface AutoTableProps {
  data: Record<string, any>[]; 
  className?: string;
}

export default function AutoTable({ data, className = "" }: AutoTableProps) {
  if (!data || data.length === 0) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className={`w-full border-collapse ${className} text-sm`}>
      <thead className="bg-gray-100 dark:bg-gray-800">
      <tr>
        {headers.map((header) => {
          // Replace dash/underscore with space, capitalize first letter
          const formattedHeader = header
            .replace(/[-_]/g, " ") // dash or underscore → space
            .replace(/^./, (c) => c.toUpperCase()); // first letter capital
          return (
            <th
              key={header}
              className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100 text-base font-semibold"
            >
              {formattedHeader}
            </th>
          );
        })}
      </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr 
            key={rowIndex} 
            className={rowIndex % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
            {headers.map((header) => (
              <td 
                key={header}
                className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300">
                {row[header] !== null && row[header] !== undefined ? row[header] : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
