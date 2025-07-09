import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TopNav from "./TopNav";
import { uploadPdf, uploadUrl, fetchBulkInstructions, uploadBulkUrls, downloadBulkTemplate } from '../utils/api';

export default function AdminUpload() {
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadDetails, setUploadDetails] = useState(null);

  // Web URL form state
  const [webUrl, setWebUrl] = useState("");
  const [webUrlTitle, setWebUrlTitle] = useState("");
  const [submittingUrl, setSubmittingUrl] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [urlSuccess, setUrlSuccess] = useState("");
  const [urlUploadDetails, setUrlUploadDetails] = useState(null);

  // Bulk import state
  const [bulkInstructions, setBulkInstructions] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);
  const { jwt } = useAuth();
  const [tab, setTab] = useState("single"); // 'single' or 'bulk'

  // Only fetch instructions/template when Bulk Import tab is selected
  const fetchBulkInstructionsHandler = async () => {
    try {
      const instructions = await fetchBulkInstructions();
      setBulkInstructions(instructions);
    } catch (err) {
      setBulkInstructions('Failed to load instructions.');
    }
  };

  useEffect(() => {
    if (tab === "bulk") {
      fetchBulkInstructionsHandler();
    }
  }, [tab]);

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkUploading(true);
    setBulkResults(null);
    try {
      const results = await uploadBulkUrls(bulkFile, jwt);
      setBulkResults(results);
    } catch (err) {
      setBulkResults([]);
    }
    setBulkUploading(false);
  };

  // Upload PDF automatically after file selection
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      const uploadTitle = title || selectedFile.name;
      await handleUpload(selectedFile, uploadTitle, sourceUrl);
    } else {
      setFile(null);
      setError("Please select a PDF file");
    }
  };

  // Upload handler
  const handleUpload = async (fileToUpload, uploadTitle, uploadSourceUrl) => {
    setUploading(true);
    setError("");
    setSuccess("");
    setUploadDetails(null);
    try {
      const result = await uploadPdf({ file: fileToUpload, title: uploadTitle, sourceUrl: uploadSourceUrl }, jwt);
      setSuccess("File uploaded successfully!");
      setUploadDetails(result);
      setFile(null);
      setTitle("");
      setSourceUrl("");
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle web URL submission
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!webUrl.trim()) {
      setUrlError("Please enter a valid URL");
      return;
    }
    if (!webUrlTitle.trim()) {
      setUrlError("Please enter a title for the URL");
      return;
    }

    setSubmittingUrl(true);
    setUrlError("");
    setUrlSuccess("");
    setUrlUploadDetails(null);

    try {
      const result = await uploadUrl({ url: webUrl.trim(), title: webUrlTitle.trim() }, jwt);
      setUrlSuccess("URL processed successfully!");
      setUrlUploadDetails(result);
      setWebUrl("");
      setWebUrlTitle("");
    } catch (err) {
      setUrlError(err.message || "Failed to process URL. Please try again.");
    } finally {
      setSubmittingUrl(false);
    }
  };

  const handleTemplateDownload = async (e) => {
    e.preventDefault();
    try {
      const blob = await downloadBulkTemplate(jwt);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bulk-upload-template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Optionally show error
    }
  };

  // Tab change handler
  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (newTab === "bulk" && !bulkInstructions) {
      fetchBulkInstructionsHandler();
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      <TopNav />
      <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === "single"
                ? "bg-amber-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleTabChange("single")}
          >
            Single Upload
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === "bulk"
                ? "bg-amber-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleTabChange("bulk")}
          >
            Bulk Import
          </button>
        </div>
        {tab === "single" && (
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Admin Upload
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Title
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 mb-4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave blank to use file name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL
                </label>
                <input
                  type="url"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base py-3 mb-4"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload PDF
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
              </div>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              )}
              {uploadDetails && (
                <div className="rounded-md bg-blue-50 p-4 mt-2">
                  <div className="text-sm text-blue-900 font-semibold mb-1">
                    {uploadDetails.message}
                  </div>
                  <div className="text-sm text-gray-800">
                    <div>
                      <strong>Title:</strong> {uploadDetails.title}
                    </div>
                    {uploadDetails.source_url && (
                      <div>
                        <strong>Source URL:</strong>{" "}
                        <a
                          href={uploadDetails.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {uploadDetails.source_url}
                        </a>
                      </div>
                    )}
                    <div>
                      <strong>Retrieved Date:</strong>{" "}
                      {uploadDetails.retrieved_date
                        ? new Date(
                            uploadDetails.retrieved_date
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      <strong>Number of Chunks:</strong>{" "}
                      {uploadDetails.num_chunks}
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-gray-400 font-semibold">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Web URL Input Section */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Add Web URL</h3>
                <form className="space-y-4" onSubmit={handleUrlSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Web URL
                    </label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-700 focus:ring-amber-700 text-base py-3 mb-4"
                      placeholder="https://example.com/article"
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      disabled={submittingUrl}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-700 focus:ring-amber-700 text-base py-3 mb-4"
                      placeholder="Enter a title for this URL"
                      value={webUrlTitle}
                      onChange={(e) => setWebUrlTitle(e.target.value)}
                      disabled={submittingUrl}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    disabled={submittingUrl}
                  >
                    {submittingUrl ? "Processing..." : "Submit URL"}
                  </button>
                </form>

                {urlError && (
                  <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="text-sm text-red-700">{urlError}</div>
                  </div>
                )}
                {urlSuccess && (
                  <div className="rounded-md bg-green-50 p-4 mt-4">
                    <div className="text-sm text-green-700">{urlSuccess}</div>
                  </div>
                )}
                {urlUploadDetails && (
                  <div className="rounded-md bg-blue-50 p-4 mt-4">
                    <div className="text-sm text-blue-900 font-semibold mb-1">
                      {urlUploadDetails.message}
                    </div>
                    <div className="text-sm text-gray-800">
                      <div>
                        <strong>Title:</strong> {urlUploadDetails.title}
                      </div>
                      <div>
                        <strong>URL:</strong>{" "}
                        <a
                          href={urlUploadDetails.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {urlUploadDetails.source_url}
                        </a>
                      </div>
                      <div>
                        <strong>Retrieved Date:</strong>{" "}
                        {urlUploadDetails.retrieved_date
                          ? new Date(
                              urlUploadDetails.retrieved_date
                            ).toLocaleString()
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Number of Chunks:</strong>{" "}
                        {urlUploadDetails.num_chunks}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {tab === "bulk" && (
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Bulk Import URLs
            </h2>
            {bulkInstructions && (
              <div className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg max-h-72 overflow-y-auto text-gray-800">
                {bulkInstructions.split("\n").map((line, idx) =>
                  line.trim().startsWith("url | title") ||
                  line.trim().startsWith("----------------") ||
                  line.trim().startsWith("https://") ? (
                    <div
                      key={idx}
                      className="font-mono text-sm text-gray-700 whitespace-pre"
                    >
                      {line}
                    </div>
                  ) : (
                    <div key={idx} className="mb-2">
                      {line}
                    </div>
                  )
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleTemplateDownload}
              className="inline-block mb-4 text-blue-700 underline font-medium bg-transparent border-none p-0 cursor-pointer"
            >
              Download XLSX Template
            </button>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setBulkFile(e.target.files[0])}
                className="block border border-gray-300 rounded px-3 py-2 text-base"
              />
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile || bulkUploading}
                className="bg-amber-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
              >
                {bulkUploading ? "Uploading..." : "Upload XLSX"}
              </button>
            </div>
            {bulkResults && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Import Results</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bulkResults.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-blue-700">
                            {row.url ? (
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {row.url}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-2">{row.title || "—"}</td>
                          <td className="px-4 py-2 font-semibold {row.success ? 'text-green-700' : 'text-red-700'}">
                            {row.success ? "Success" : "Failed"}
                          </td>
                          <td className="px-4 py-2">
                            {row.message || row.error || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
