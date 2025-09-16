"use client";
import { useEffect, useState } from "react";
import { items } from "@/constants/items";
import { crud_pricing } from "@/utils/requestUtils";
import PricingInput from "@/components/pricingInputs";
import { filterOutItems } from "@/utils/filteroutItems";
import { notify } from "@/components/Notify";

// Filtered items at top
const filteredItems = filterOutItems(items);

// Helper function at top
const formatPayload = (formData: Record<string, any>) => {
  const payload: Record<string, any> = {};
  Object.entries(formData).forEach(([key, val]) => {
    const num = Number(val);
    payload[key] = val === "" ? null : isNaN(num) ? val : num;
  });
  return payload;
};

export default function Pricings() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fetched, setFetched] = useState(false);

  // fetch_pricings
  useEffect(() => {
    async function fetch_pricings() {
      try {
        const data: Array<{ type: "cost" | "sell"; [key: string]: any }> = await crud_pricing("fetch");
        const costRow = data.find((row) => row.type === "cost") || {};
        const sellRow = data.find((row) => row.type === "sell") || {};
        const initialData: Record<string, any> = {};

        filteredItems.forEach((item) => {
          const costValue = (costRow as Record<string, any>)[item.name] ?? "";
          const sellValue = (sellRow as Record<string, any>)[item.name] ?? "";
          initialData[`${item.name}_cost`] = costValue;
          initialData[`${item.name}_sell`] = sellValue;
        });

        setFormData(initialData);
        setFetched(true);
      } catch (err) {
        console.error(err);
      }
    }

    fetch_pricings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // update_pricings
  const update_pricings = async () => {
    try {
      const payload = formatPayload(formData);
      await crud_pricing("update", payload);
      notify("Pricing updated successfully!", "success");
    } catch (err) {
      console.error("Error updating pricings:", err);
      notify("Failed to update pricings", "error");
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricings Dashboard</h1>
      
      {/* body */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.name}
            className="sd-full-shadow rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-lg group transition-transform transform 
              hover:-translate-y-3 hover:scale-105 hover:shadow-2xl">
            <h2 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">{item.label}</h2>
            <PricingInput label="Cost" name={`${item.name}_cost`} value={formData[`${item.name}_cost`] ?? ""} onChange={handleChange} />
            <PricingInput label="Sell" name={`${item.name}_sell`} value={formData[`${item.name}_sell`] ?? ""} onChange={handleChange} />
          </div>
        ))}

        {/* Update pricing */}
        {fetched && (
          <button onClick={update_pricings}
            className="fixed bottom-6 right-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full
              hover:from-blue-700 hover:to-green-600 transition-all z-50">
            Update
          </button>
        )}
      </div>
    </main>
  );
}
