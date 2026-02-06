"use client";

import { useState } from "react";
import { FileSpreadsheet, X, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { importProducts } from "@/app/actions/product";

export default function ImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTemplateInfo, setShowTemplateInfo] = useState(false);
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
    setShowTemplateInfo(true);
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
        toast.success("Products imported successfully!");
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
            <p className="text-sm text-slate-500">
              Upload an Excel file to bulk import products
            </p>

            {/* Content */}
            {!success ? (
              <div className="mt-6 space-y-5">
                {/* Help text */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-semibold text-blue-900">
                        Required columns (case-insensitive):
                      </p>
                      <p className="mb-2 font-mono text-xs text-blue-700">
                        name, category, price, stock
                      </p>
                      <p className="mb-3 text-xs text-blue-600">
                        💡 You can use any capitalization: Name, NAME, name, NaMe, etc.
                      </p>
                      <button
                        onClick={handleDownloadTemplate}
                        className="text-sm font-medium text-blue-700 underline hover:text-blue-800"
                      >
                        View Template Format →
                      </button>
                    </div>
                  </div>
                </div>

                {/* File input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Excel File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-900 transition-colors file:mr-4 file:cursor-pointer file:border-0 file:bg-emerald-600 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                    />
                  </div>
                  {file && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-emerald-900">
                          Selected file:
                        </p>
                        <p className="truncate text-sm text-emerald-700">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">Error</p>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 border-t border-slate-200 pt-5">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!file || isLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Importing..." : "Import Products"}
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

      {/* Template Info Modal */}
      {showTemplateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowTemplateInfo(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Template Format
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="font-medium text-slate-700">
                    Column Headers (case-insensitive):
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 font-mono text-xs">
                    name | category | price | stock
                  </div>

                  <p className="font-medium text-slate-700">Example:</p>
                  <div className="overflow-x-auto rounded-lg bg-slate-50 p-3">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-2 py-1 text-left font-mono">name</th>
                          <th className="px-2 py-1 text-left font-mono">category</th>
                          <th className="px-2 py-1 text-left font-mono">price</th>
                          <th className="px-2 py-1 text-left font-mono">stock</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr>
                          <td className="px-2 py-1">Laptop</td>
                          <td className="px-2 py-1">Electronics</td>
                          <td className="px-2 py-1">999.99</td>
                          <td className="px-2 py-1">5</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1">Mouse</td>
                          <td className="px-2 py-1">Electronics</td>
                          <td className="px-2 py-1">25.00</td>
                          <td className="px-2 py-1">50</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1">Keyboard</td>
                          <td className="px-2 py-1">Electronics</td>
                          <td className="px-2 py-1">49.99</td>
                          <td className="px-2 py-1">20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="flex items-center gap-2 text-emerald-700">
                      <span className="text-lg">✓</span>
                      <span>You can write: Name, NAME, name, NaMe, etc. All will work!</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTemplateInfo(false)}
                  className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
