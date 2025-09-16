"use client";
import React, { ReactNode } from "react";

type DefCardWrapperProps = {
  heading: string;
  children?: ReactNode;
};

export default function DefCardWrapper({ heading, children }: DefCardWrapperProps) {
  return (
    <div className="card_wprapper mb-12">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4">{heading}</h2>

      {/* Container for cards */}
      <div className="grid grid-cols-2 gap-6 below-600">
        {children}
      </div>
    </div>
  );
}