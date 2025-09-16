"use client";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/kittens.html"
        className="w-full h-full border-0"
      />
    </div>
  );
}