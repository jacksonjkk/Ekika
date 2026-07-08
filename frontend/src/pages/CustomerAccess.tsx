import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginCustomer } from "../data/api";

export default function CustomerAccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = safeRedirectPath(searchParams.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginCustomer(email, password);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 max-w-xl mx-auto">
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl border border-outline-variant/10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
          Welcome Back
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl font-black text-on-surface mb-4">
          Sign in to your account
        </h1>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          Open your dashboard to view and manage your experiences.
        </p>

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700 mb-5" role="alert">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={signIn}>
          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">EMAIL ADDRESS</span>
            <input
              autoComplete="email"
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="traveler@world.com"
              type="email"
              value={email}
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">PASSWORD</span>
            <div className="relative">
              <input
                autoComplete="current-password"
                className="w-full h-14 bg-surface-container-high border-none rounded-xl pl-4 pr-12 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>
          <button
            className="w-full min-h-14 rounded-xl bg-primary hover:bg-primary-container text-white px-5 py-3 font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            disabled={loading}
            type="submit"
          >
            <span>{loading ? "Signing In..." : "Sign In"}</span>
            <span className="material-symbols-outlined" aria-hidden="true">login</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link className="text-primary font-bold hover:underline" to={`/signup?redirect=${encodeURIComponent(redirectPath)}`}>
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}

function safeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/customer-portal";
  return value;
}
