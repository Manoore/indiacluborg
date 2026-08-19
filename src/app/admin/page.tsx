"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import { adminLoginAction } from "@/app/actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await adminLoginAction(email, password);
      if (result?.error) {
        setError(result.error);
        setSubmitting(false);
      }
      // On success adminLoginAction redirects — nothing else to do here.
    } catch (err) {
      if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setError("Sign-in isn't configured yet — set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-navy px-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <Heart className="mx-auto mb-2" size={32} fill="#e11d48" color="#e11d48" />
          <h1 className="font-display text-xl font-extrabold text-navy">Team India Heart Walk</h1>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-foreground/50">
            <Lock size={12} /> Administrator Login
          </p>
        </div>
        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-navy/70">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="admin@teamindia.org"
          />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-semibold text-navy/70">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mb-4 text-sm font-medium text-heart-deep">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-heart py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-heart-deep disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </motion.form>
    </main>
  );
}
