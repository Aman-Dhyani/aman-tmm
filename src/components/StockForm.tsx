"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SingleInput, DoubleInput } from "@/components/FormInputs";
import FormModal from "@/components/FormModal";
import LoadingButton from "@/components/LoadingButton";
import { items } from "@/constants/items";
import { notify } from "@/components/Notify";
import { validateForm, calculateStock, validate_inventory, update_inventory, update_sales, fetch_current_inventory,} from "@/utils/requestUtils";
import { getFormattedDate } from "@/utils/dateUtils";

export default function StockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = getFormattedDate();

  // ✅ Safely read search params with fallback
  const form_label = searchParams?.get("label") || "";
  const form_branch = searchParams?.get("branch") || "";
  const form_type = searchParams?.get("type") || "";

  // state variables
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<Record<string, number> | string>("");
  const [calcData, setCalcData] = useState<Record<string, number> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formModalHeading, setFormModalHeading] = useState("Alert!!!")

  // ------------------- Handlers -------------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      // 1. validate form
      if (!validateForm(formData)) {
        notify("Invalid Form!!!", "error");
        return;
      }

      setIsSubmitting(true);

      // 2. calculate stock
      const calculated = calculateStock(formData);
      setCalcData(calculated);

      // 3. Modal / stock-out / correction logic
      if (form_type !== "stock-in") {
        let modalData: Record<string, number> = {};

        if (form_type === "stock-out") {
          modalData = Object.fromEntries(
            Object.entries(calculated).filter(([_, v]) => v >= 100)
          );
        } else if (form_type === "correction") {
          const currentInventory = await fetch_current_inventory();

          for (const key of Object.keys(calculated)) {
            const current = Number(currentInventory[key] || 0);
            modalData[key] = Number(calculated[key]) - current;
          }
          setFormModalHeading("Calculated Values")
        }

        if (Object.keys(modalData).length > 0) {
          setModalContent(modalData);
          setShowModal(true);
          return;
        }

        await submit_stocks(calculated);
      } else {
        // stock-in
        const res = await validate_inventory(form_branch, form_type, calculated);
        if (res?.error) {
          notify(res.error, "error");
        } else {
          await submit_sales(res, calculated);
          await submit_stocks(calculated);
        }
      }
    } catch (error) {
      console.error("❌ Error saving stock:", error);
      notify("Something went wrong while saving stock. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ------------------- Database Functions -------------------
  async function submit_stocks(data: Record<string, number>) {
    try {
      const res = await update_inventory(form_branch, form_type, data);
      if (res && form_type !== "stock-in") handleReset(res);
    } catch (err) {
      console.error(err);
      notify("Failed to submit stock", "error");
    }
  }

  async function submit_sales(resData: any, data: Record<string, number>) {
    const salesData: Record<string, number> = {};
    for (const key of Object.keys(resData)) {
      salesData[key] = (resData[key] || 0) - (data[key] || 0);
    }

    try {
      const res = await update_sales(form_branch, form_type, salesData);
      if (res) handleReset(res);
    } catch (err) {
      console.error(err);
      notify("Failed to submit sales", "error");
    }
  }

  function handleReset(res: any) {
    setShowModal(false);
    setModalContent("");
    setCalcData(null);

    notify(res.message, "success");
    if (form_type === "stock-in" || form_type === "stock-out") router.push("/home");
    else router.push("/extras");
  }

  // ------------------- Render -------------------
  return (
    <main className="pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-8">{form_label}</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* Date Field */}
          <div className="mb-6 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="text"
              name="date"
              placeholder={date}
              disabled
              className="py-[10px] px-[12px] w-full font-medium rounded-[8px] border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Other Inputs */}
          {items.map((item) =>
            item.type === "single" ? (
              <SingleInput key={item.name} label={item.label} name={item.name} />
            ) : (
              <DoubleInput key={item.name} label={item.label} name={item.name} />
            )
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <LoadingButton type="submit" loading={isSubmitting}>
              {form_type === "correction" ? "Calculate" : "Save"}
            </LoadingButton>
          </div>
        </form>

        {/* Modal */}
        {showModal && calcData && typeof modalContent === "object" && (
          <FormModal
            heading={formModalHeading}
            content={modalContent} // TypeScript now knows this is Record<string, number>
            onClose={() => setShowModal(false)}
            onSave={async () => {
              await submit_stocks(calcData);
            }}
          />
        )}
      </div>
    </main>
  );
}
