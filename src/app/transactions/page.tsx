"use client";

import LoadingButton from "@/components/LoadingButton";
import { update_transactions, validateForm } from "@/utils/requestUtils";
import { getFormattedDate } from "@/utils/dateUtils";
import { useState } from "react";
import { notify } from "@/components/Notify";

export default function Transactions() {
  const date = getFormattedDate();
  const [branch, setBranch] = useState("branch1");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      notify("Invalid Form!!!", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await update_transactions(branch, amount);
      setAmount("");
    } catch (error) {
      console.error(error);
      notify("Failed to save transaction", "error");
    } finally {
      setIsSubmitting(false);
      notify("saved", "success");
    }
  }

  return (
    <main className="pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-8">Transactions</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {/* date field */}
          <div className="mb-6 w-[100%]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input type="text" name="date"  placeholder={date} disabled
              className="py-[10px] px-[12px] w-[100%] font-medium rounded-[8px] border border-gray-300 dark:border-gray-500 
              bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          {/* Branch selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="branch">Branch</label>
            <div className="relative w-full">
              <select id="branch" value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="py-[10px] px-[12px] w-[100%] font-medium rounded-[8px] border border-gray-300 dark:border-gray-500 bg-white 
                dark:bg-gray-800 text-black dark:text-white appearance-none pr-10">
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
              </select>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round"  strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Amount field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <input type="number" name="amount" value={amount} placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
              className="py-[10px] px-[12px] w-[100%] font-medium rounded-[8px] border border-gray-300 dark:border-gray-500 
                bg-white dark:bg-gray-800 text-black dark:text-white           
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-moz-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-6">
            <LoadingButton type="submit" loading={isSubmitting}>Save</LoadingButton>
          </div>
        </form>
      </div>
    </main>
  );
}
