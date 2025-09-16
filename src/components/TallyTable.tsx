"use client";
import { formatDateOnly } from "@/utils/dateUtils";
import React from "react";
import { items } from "@/constants/items";

interface SimpleTallyTableProps {
  data: Record<string, any>[];
}

export default function TallyTable({ data }: SimpleTallyTableProps) {
  if (!data || data.length === 0) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  const headerLabels: Record<string, string> = {};
  items.forEach((item) => {
    headerLabels[item.name] = item.label;
  });

  const formatHeader = (header: string) => {
    if (header === "Date") return "Date";

    let prefix = "";
    let keyName = header;

    if (header.startsWith("sales_")) {
      prefix = "(sales)";
      keyName = header.replace("sales_", "");
    } else if (header.startsWith("pos_sales_")) {
      prefix = "(pos sales)";
      keyName = header.replace("pos_sales_", "");
    }

    const label = headerLabels[keyName] || keyName.replace(/_/g, " ");
    return `${label} ${prefix}`;
  };

  return (
    <div className="overflow-auto rounded tally_table_scroll">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
          <tr>
            {headers.map((header, idx) => (
              <th key={header}
                className={`border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100 text-base font-semibold whitespace-nowrap ${
                  idx === 0
                    ? "sticky left-0 bg-gray-100 dark:bg-gray-800 z-10"
                    : ""
                }`}>
                {formatHeader(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}
              className={
                rowIdx % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-800"
              }>
              {headers.map((header, colIdx) => (
                <td key={header}
                  className={`border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap ${
                    colIdx === 0 ? "sticky left-0 z-20" : ""
                  }`}
                  style={{
                    backgroundColor:
                      colIdx === 0
                        ? rowIdx % 2 === 0
                          ? "white"
                          : "rgb(249 250 251)"
                        : undefined,
                  }}>
                  {header === "Date"
                    ? formatDateOnly(row[header])
                    : row[header] !== null && row[header] !== undefined
                    ? row[header]
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
