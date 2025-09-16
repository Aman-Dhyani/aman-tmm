"use client";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function CustomModal({ isOpen, onClose, title, children,}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black z-40 cs-modal-overlay" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-2xl relative shadow-lg pointer-events-auto">
          {/* Title */}
          {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

          {/* Content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
