"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#ebefe2] px-6 border border-transparent rounded-[4px] shadow-[0_4px_6px_#00000040] z-51">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          {/* Site Name on the left */}
          <div className="text-2xl font-bold text-gray-800 font-[monospace] tracking-tight">
            Pakaja
          </div>

          {/* Logo on the right */}
          <Link href="/home" className="flex items-center">
            <div className="absolute w-[40px] h-[40px] relative">
              <Image
                src="/assets/pakaja.png"
                alt="Pakaja Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
