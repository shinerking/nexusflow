"use client";

import { useState } from "react";
import { FileSpreadsheet, X, Loader2 } from "lucide-react";
import { importProducts } from "@/app/actions/product";

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls")
      ) {
        setError("Please select an .xlsx or .xls file");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDownloadTemplate = () => {
    alert(
      "Template format (Column headers can be uppercase, lowercase, or mixed):\n\nColumn Headers: name, category, price, stock\n\nExample:\nname        | category    | price  | stock\nLaptop      | Electronics | 999.99 | 5\nMouse       | Electronics | 25.00  | 50\nKeyboard    | Electronics | 49.99  | 20\n\n✓ You can write: Name, NAME, name, NaMe, etc.\nAll will work the same way!"
    );
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await importProducts(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setFile(null);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to import products";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        title="Import products from Excel"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Import Excel
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Import Products from Excel
            </h2>

            {/* Content */}
            {!success ? (
              <div className="space-y-4">
                {/* Help text */}
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <p className="mb-2 font-medium">Required columns (case-insensitive):</p>
                  <p>name, category, price, stock</p>
                  <p className="mt-2 text-xs text-blue-600">
                    💡 You can use any capitalization: Name, NAME, name, NaMe, etc.
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="mt-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Download Template
                  </button>
                </div>

                {/* File input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Select Excel File
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-emerald-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!file || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Import
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-center text-sm font-medium text-slate-700">
                  Products imported successfully!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
