"use client";
import React, { useState } from "react";
import LoadingButton from "./LoadingButton";
import { notify } from "./Notify";
import AutoTable from "./AutoTable"; // import your reusable table
import { items } from "@/constants/items";

interface FormModalProps {
  heading: string;
  content: Record<string, number>; // object directly, no parsing
  onClose: () => void;
  onSave: () => void;
}

export default function FormModal({
  heading,
  content,
  onClose,
  onSave,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize content keys to labels for AutoTable
  const tableData = Object.entries(content).map(([key, value]) => {
    const label = items.find((i) => i.name === key)?.label || key;
    return { "Item Name": label, Pieces: value };
  });

  // handle Submit
  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      await onSave();
    } catch (error) {
      console.error(error);
      notify("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full shadow-lg">
        {/* Modal Header */}
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {heading}
        </h2>

        {/* AutoTable */}
        <div className="rounded-lg max-h-100 overflow-y-auto">
          <AutoTable
            data={tableData}
            className="text-sm border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 px-4 py-2 rounded-lg bg-red-800 text-white text-center"
            onClick={onClose}
          >
            Cancel
          </button>
          <LoadingButton
            type="button"
            loading={isSubmitting}
            onClick={handleSubmit}
            className="flex-1 px-4 py-2">
            Save
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
