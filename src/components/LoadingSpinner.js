// src/components/LoadingSpinner.js
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-700"></div>
    </div>
  );
}