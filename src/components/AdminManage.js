import React, { useState } from "react";

import AdminPDFs from "./AdminPDFs";
import AdminURLs from "./AdminURLs";

import TopNav from "./TopNav";

export default function AdminManage() {
  const [tab, setTab] = useState("pdfs");

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      <TopNav />
      {/* Tabs */}
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === "pdfs"
                ? "bg-amber-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("pdfs")}
          >
            PDFs
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === "urls"
                ? "bg-amber-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("urls")}
          >
            URLs
          </button>
        </div>
        <div>{tab === "pdfs" ? <AdminPDFs /> : <AdminURLs />}</div>
      </div>
    </div>
  );
}
