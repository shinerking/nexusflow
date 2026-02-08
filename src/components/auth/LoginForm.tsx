"use client";

import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions/auth";
import { AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-70 disabled:hover:scale-100 sm:text-base"
    >
      {/* Button Shine Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <span className="relative flex items-center justify-center gap-2">
        {pending ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </>
        )}
      </span>
    </button>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  return (
    <form action={login} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>
            {message === "user_not_found"
              ? "Akun tidak ditemukan. Pastikan email benar."
              : "Terjadi kesalahan saat login."}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-200"
        >
          Email Address
        </label>
        <div className="relative">
          {/* Email Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@nexusflow.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:text-base"
            autoComplete="email"
          />
        </div>
      </div>

      <SubmitButton />

      {/* Demo Credentials Hint */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 backdrop-blur-sm">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-300/80 sm:text-[10px]">
          Demo Credentials
        </h4>
        <div className="space-y-1.5">
          <p className="text-xs text-slate-300 sm:text-sm">
            <span className="font-semibold text-blue-300">Admin:</span> admin@nexusflow.com
          </p>
          <p className="text-xs text-slate-300 sm:text-sm">
            <span className="font-semibold text-blue-300">Staff:</span> staff@nexusflow.com
          </p>
          <p className="text-xs text-slate-400 sm:text-sm">
            <span className="font-semibold text-blue-300">Auditor:</span> auditor@nexusflow.com
          </p>
        </div>
      </div>
    </form>
  );
}
