import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl md:h-96 md:w-96" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl md:h-96 md:w-96" />

      {/* Login Card with Glassmorphism */}
      <div className="relative z-10 mx-4 w-full max-w-md sm:mx-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg shadow-blue-500/50">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              NexusFlow
            </h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Watermark */}
          <div className="fixed bottom-2 md:bottom-2 left-0 right-0 flex justify-center pointer-events-none px-4 z-50">
            <p className="pointer-events-auto cursor-default text-[9px] md:text-[10px] tracking-[0.25em] transition-all duration-500 ease-in-out opacity-25 hover:opacity-90 hover:tracking-[0.35em] text-slate-300 font-light">
              Developed by <span className="text-indigo-300">Abimanyu R P</span>
            </p>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute -bottom-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
    </div>
  );
}
