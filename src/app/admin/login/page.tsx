"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LoginState = "idle" | "loading" | "error" | "success";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-campaign-green-50 to-white"><p className="text-campaign-green-800">Loading...</p></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";

  const validateRedirect = useCallback((target: string): string => {
    if (!target || typeof target !== "string") return "/admin";
    const trimmed = target.trim();
    if (!trimmed.startsWith("/admin") || trimmed === "/admin/login" || trimmed === "/admin/logout") {
      return "/admin";
    }
    return trimmed;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState("loading");
      setErrorMessage("");

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          credentials: "include",
        });

        let data: { success?: boolean; error?: string } = {};
        try {
          data = await res.json();
        } catch {
          setState("error");
          setErrorMessage("Invalid response from server. Please try again.");
          return;
        }

        if (!res.ok) {
          setState("error");
          setErrorMessage(data.error ?? "Invalid password");
          return;
        }

        setState("success");
        const target = validateRedirect(redirect);
        router.push(target);
        router.refresh();
      } catch (err) {
        setState("error");
        setErrorMessage(
          err instanceof Error && err.message
            ? err.message
            : "Network error. Please check your connection and try again."
        );
      }
    },
    [password, redirect, router, validateRedirect]
  );

  const isLoading = state === "loading";
  const hasError = state === "error";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-campaign-green-50 to-white">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-campaign-green-200 bg-white shadow-xl overflow-hidden">
          <div className="bg-hero-gradient px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 text-white mb-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Admin Login
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Campaign Dashboard Access
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (hasError) {
                      setState("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-campaign-green-500 focus:border-campaign-green-500 outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  required
                  autoFocus
                  autoComplete="current-password"
                  disabled={isLoading}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? "login-error" : undefined}
                />
              </div>

              {hasError && (
                <div
                  id="login-error"
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm"
                >
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-campaign-green-600 text-white font-semibold rounded-lg hover:bg-campaign-green-700 focus:outline-none focus:ring-2 focus:ring-campaign-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
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
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-campaign-green-600 hover:text-campaign-green-800 font-medium"
              >
                ← Back to campaign site
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
