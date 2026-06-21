import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerCustomer } from "../data/api";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? "/customer-portal";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await registerCustomer(name, email, password, phone);
      navigate(redirectPath);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to register account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 max-w-xl mx-auto">
      <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl border border-outline-variant/10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
          Create Account
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl font-black text-on-surface mb-4">
          Register with Ekika
        </h1>
        <p className="text-on-surface-variant leading-relaxed mb-8">
          Register to book authentic cultural experiences, keep track of your itineraries, and view hosts contact info.
        </p>

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700 mb-5" role="alert">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">FULL NAME</span>
            <input
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              onChange={(event) => setName(event.target.value)}
              placeholder="Abebe Bikila"
              type="text"
              value={name}
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">EMAIL ADDRESS</span>
            <input
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="traveler@world.com"
              type="email"
              value={email}
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">PHONE NUMBER</span>
            <input
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+256 700 000 000"
              type="tel"
              value={phone}
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-bold text-on-surface tracking-wide mb-2 px-1">PASSWORD (8+ CHARACTERS)</span>
            <input
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              type="password"
              value={password}
              required
            />
          </label>

          <button
            className="w-full min-h-14 rounded-xl bg-primary hover:bg-primary-container text-white px-5 py-3 font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            disabled={loading}
            type="submit"
          >
            <span>{loading ? "Registering..." : "Register & Sign In"}</span>
            <span className="material-symbols-outlined">person_add</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link className="text-primary font-bold hover:underline" to={`/customer-access?redirect=${encodeURIComponent(redirectPath)}`}>
            Sign in here
          </Link>
        </div>
      </div>
    </main>
  );
}
