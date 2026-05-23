'use client'

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UX State Management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    await authClient.signIn.email({
      email,
      password,
      callbackURL: "/"
    }, {
      onRequest: () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: () => {
        setIsLoading(false);
        setIsSuccess(true);
      },
      onError: (ctx) => {
        setIsLoading(false);
        setError(ctx.error.message || "Invalid email or password. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-app-bg)] px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-[var(--color-brand-indigo)] selection:text-white">
      <div className="w-full max-w-md space-y-8 bg-[var(--color-app-surface)] p-8 rounded-2xl border border-zinc-800/50 shadow-2xl backdrop-blur-sm relative overflow-hidden transition-all duration-300">

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-brand-indigo)] via-[var(--color-brand-purple)] to-[var(--color-brand-pink)]" />

        {isSuccess && (
          <div className="absolute inset-0 bg-[var(--color-app-surface)] z-10 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-[var(--color-status-live)] text-[var(--color-status-live)] rounded-full flex items-center justify-center mb-4 animate-scale-up">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Welcome back!</h3>
            <p className="text-sm text-zinc-400 mt-2">Authenticated successfully. Fetching your dashboard...</p>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Sign in
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Welcome back! Enter your details to access your account.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-amber-500/10 border border-[var(--color-status-draft)] text-[var(--color-status-draft)] p-3.5 rounded-xl text-sm transition-all duration-200">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-indigo)] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[var(--color-brand-purple)] hover:text-[var(--color-brand-pink)] transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-indigo)] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[var(--color-brand-indigo)] to-[var(--color-brand-purple)] hover:from-[var(--color-brand-purple)] hover:to-[var(--color-brand-pink)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-app-surface)] focus:ring-[var(--color-brand-indigo)] transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-white hover:text-[var(--color-brand-indigo)] font-medium transition-colors underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;