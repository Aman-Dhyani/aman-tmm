"use client";
import { fetch_current_inventory } from "@/utils/requestUtils";
import { useEffect, useState } from "react";
import { items } from "@/constants/items";
import AutoTable from "@/components/AutoTable";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<Record<string, number>>({});
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch_current_inventory(); // { Red_Chutney: -87, ... }
        const parsed: Record<string, number> = {};
        for (const key in res) parsed[key] = Number(res[key]);
        setInventoryData(parsed);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    }

    load();
  }, []);

  // Convert inventory + items to AutoTable format
  useEffect(() => {
    const formatted: Record<string, any>[] = items.map((item) => {
      const value = inventoryData[item.name] ?? null;

      // Packets & Pieces calculation
      let packetsPieces = "-";
      if (value !== null && item.multiplier > 1) {
        const packets = Math.floor(value / item.multiplier);
        const pieces = Math.abs(value) % item.multiplier;
        packetsPieces = packets !== 0 ? `${packets} packets and ${pieces} pieces` : `${pieces} pieces`;
      } else if (value !== null) {
        packetsPieces = `${value} pieces`;
      }

      return {
        "Item Name": item.label,
        "Value": value !== null ? value : "-",
        "Packets & Pieces": packetsPieces,
      };
    });

    setTableData(formatted);
  }, [inventoryData]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Current Inventory</h1>
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-neutral-900 p-4 sd-full-shadow">
        <AutoTable data={tableData} />
      </div>
    </main>
  );
}
