"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Notify from "@/components/Notify";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/";

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={hideLayout ? "" : "pt-28"}>{children}</main>
      {!hideLayout && <Notify />}
    </>
  );
}
