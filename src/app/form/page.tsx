"use client";
import { Suspense } from "react";
import StockForm from "@/components/StockForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockForm />
    </Suspense>
  );
}
