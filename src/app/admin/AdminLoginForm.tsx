"use client";

import { useState } from "react";
import { adminLogin } from "@/app/actions/admin";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await adminLogin(password, email);
    setSubmitting(false);

    if (res.success) {
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Authentication failed.");
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-surface p-8 shadow-lift sm:p-10">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-spruce text-teal-200">
            <Lock className="h-6 w-6" aria-hidden />
          </span>
          <p className="eyebrow mt-6 justify-center">Staff portal</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-3">Sign in as Super Admin or Staff Admin.</p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="field-label">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="field-label">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="field-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="admin-password"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-accent btn-lg w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-8 flex items-center justify-center gap-1.5 border-t border-line pt-6 text-xs text-ink-3">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-ink" aria-hidden />
          Encrypted session · Role-based access
        </p>
      </div>
    </div>
  );
}
