"use client";
import { useState, useMemo } from "react";
import Pagination from "./Pagination";

interface ReportsTableProps<T extends Record<string, any>> {
  data: T[];
  rowsPerPage?: number;
  onViewItems?: (items: Record<string, number>, date: string) => void;
}

// ReportsTable
export default function ReportsTable<T extends Record<string, any>>({ data, rowsPerPage = 10, onViewItems,}: ReportsTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const buttonColors = [ "bg-blue-600 hover:bg-blue-800", "bg-blue-500 hover:bg-blue-800", ];
  const totalPages = useMemo(() => Math.ceil(data.length / rowsPerPage), [data.length, rowsPerPage]);
  const currentRows = useMemo(() =>
      data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [currentPage, data, rowsPerPage]
  );

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "items" && key !== "branch").concat("Items");
  }, [data]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        {/* header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100 text-base font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody>
          {currentRows.map((row, idx) => {
            const colorClass = buttonColors[idx % buttonColors.length];

            return (
              <tr key={idx} className={ idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                {headers.map((key) => {
                  if (key === "Items") {
                    return (
                      <td key={key} className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                        <button className={`px-4 py-1 text-white rounded-full font-medium transition ${colorClass}`}
                         onClick={() => onViewItems?.(row.items, row.Date)}>
                          View
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td key={key}className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                      {row[key] ?? "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
