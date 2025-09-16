"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CustomModal from "./CustomModal";
import Pagination from "./Pagination";
import { formatDate } from "@/utils/dateUtils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const bluePalette = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

interface Item {
  name: string;
  plate?: { pieces: number };
  quantity?: number;
  pieces: number;
}

interface Row {
  id: number;
  created_at: string;
  reason: string | null;
  custom_amount: string | null;
  total: string;
  payment_method: string;
  customer_name: string | null;
  customer_phone: string | null;
  items: string;
}

interface DataResponse {
  rows: Row[];
  totalRows: number;
  totalPages: number;
  currentPage: number;
}

export default function PosReportsTable({ data, onPageChange,}: { data: DataResponse; onPageChange: (page: number) => void;}) {
  const [currentPage, setCurrentPage] = useState(data.currentPage || 1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<Item[]>([]);
  const [modalDate, setModalDate] = useState("");

  const handlePageChange = (page: number) => {
    if (page < 1 || page > data.totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleViewItems = (row: Row) => {
    let parsedItems: Item[] = [];
    try {
      parsedItems = row.items.trim().startsWith("[")
        ? JSON.parse(row.items)
        : JSON.parse(`[${row.items}]`);
    } catch (e) {
      console.error("Failed to parse items", e);
    }

    const itemsWithPieces = parsedItems.map((item) => ({
      name: item.name || "Unknown",
      pieces: (item.quantity || 0) * (item.plate?.pieces || 0),
    }));

    setModalItems(itemsWithPieces);
    setModalDate(row.created_at);
    setModalOpen(true);
  };

  const headers: (keyof Row)[] = [
    "created_at",
    "reason",
    "custom_amount",
    "total",
    "payment_method",
    "customer_name",
    "customer_phone",
  ];

  const modalChartOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
    colors: bluePalette,
    plotOptions: {
      bar: { borderRadius: 6, horizontal: false, distributed: true },
    },
    xaxis: { categories: modalItems.map((item) => item.name) },
    yaxis: { labels: { style: { colors: "currentColor" } } },
    legend: { show: false },
    grid: { show: false },
    theme: { mode: "light" },
  };

  const modalChartSeries = [
    { name: "Pieces", data: modalItems.map((item) => item.pieces) },
  ];

  return (
    <div className="overflow-x-auto w-[100%]">
      <table className="min-w-full border-collapse text-sm">
        {/* head */}
        <thead className="bg-gray-100 dark:bg-neutral-800">
          <tr>
            {headers.map((h) => {
              const formattedHeader = h
                .replace(/_/g, " ")
                .replace(/^./, (c) => c.toUpperCase());
              return (
                <th key={h}
                  className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100 text-base font-semibold">
                  {formattedHeader}
                </th>
              );
            })}
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-900 dark:text-gray-100 text-base font-semibold">Items</th>
          </tr>
        </thead>

        {/* Body   */}
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
              {headers.map((h) => (
                <td key={h} className="px-4 py-2 border-b border-gray-300 dark:border-neutral-700">
                  {h === "created_at" ? formatDate(row[h]) : row[h] ?? "-"}
                </td>
              ))}

              <td className="px-4 py-2 border-b border-gray-300 dark:border-neutral-700">
                <button onClick={() => handleViewItems(row)} className="px-6 bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600"> 
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePageChange} />

      {/* Modal */}
      {modalOpen && (
        <CustomModal isOpen={modalOpen}onClose={() => setModalOpen(false)} title={`Date: ${formatDate(modalDate)}`}>
          <Chart options={modalChartOptions} series={modalChartSeries} type="bar" height={400} />
        </CustomModal>
      )}
    </div>
  );
}
