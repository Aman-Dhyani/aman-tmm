"use client";
import React from "react";

interface LoadingButtonProps {
  loading: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  className?: string;
}

export default function LoadingButton({ loading, onClick, type = "button", children, className = "",}: LoadingButtonProps) {
  return (
    <button type={type} disabled={loading} onClick={onClick} 
      className={`flex items-center justify-center w-[160px] py-2 px-4 rounded-lg text-white cursor-pointer
      ${ loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500" } 
      ${className}`}>
        { loading ?  <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : children }
    </button>
  );
}
