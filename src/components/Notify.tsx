"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type NotificationType = "success" | "error" | "info";

let globalShow: (message: string, type?: NotificationType) => void;

export function notify(message: string, type: NotificationType = "info") {
  if (globalShow) globalShow(message, type);
}

export default function Notify() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");

  useEffect(() => {
    globalShow = (msg: string, t: NotificationType = "info") => {
      setMessage(msg);
      setType(t);
      setVisible(true);

      setTimeout(() => setVisible(false), 3000); // auto-dismiss
    };
  }, []);

  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-600";

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? XCircle : Info;

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        transition-all duration-300 ease-in-out
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}
      `}
    >
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${color} text-white font-semibold
          text-sm max-w-xs min-w-[180px] justify-center
        `}
      >
        <Icon size={16} />
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
}
