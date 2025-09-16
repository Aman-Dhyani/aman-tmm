"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange,}: PaginationProps) {
  if (totalPages <= 1) return null;
  const activeColor = "bg-blue-600 text-white";

  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
      {/* Prev */}
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-blue-600">
        { <ChevronLeft className="w-4 h-4" /> }
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage ? activeColor : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-400"
          }`}>
          {page}
        </button>
      ))}

      {/* Next */}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-blue-600">
        { <ChevronRight className="w-4 h-4" /> }
      </button>
    </div>
  );
}