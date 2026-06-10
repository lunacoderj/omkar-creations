"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
    }
  };

  const handleInstagramLogin = () => {
    signIn("instagram", { callbackUrl: "/admin" });
  };

  return (
    <div className="admin-login">
      {/* Background orbs */}
      <div className="admin-login__orb admin-login__orb--amber" />
      <div className="admin-login__orb admin-login__orb--fuchsia" />

      <div className="admin-login__container">
        {/* Logo */}
        <div className="admin-login__brand">
          <div className="admin-login__logo-wrap">
            <div className="admin-login__logo-inner">
              <span className="font-display text-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">OC</span>
            </div>
          </div>
          <h1 className="font-display text-3xl tracking-[0.15em] text-white mt-4">ADMIN</h1>
          <p className="text-white/30 text-xs mt-1.5">Omkar Creations Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="admin-login__card">
          {/* Instagram Login */}
          <button onClick={handleInstagramLogin} className="admin-login__instagram-btn">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Sign in with Instagram
          </button>

          <div className="admin-login__divider">
            <div className="admin-login__divider-line" />
            <span className="admin-login__divider-text">or use email</span>
            <div className="admin-login__divider-line" />
          </div>

          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="admin-login__form">
            <div className="admin-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@email.com"
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="admin-input"
              />
            </div>

            {error && (
              <div className="admin-login__error">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="admin-login__submit-btn">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="admin-login__spinner" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-white/20 text-[10px] text-center mt-5">
          Only authorized admins can access the dashboard.
        </p>
      </div>
    </div>
  );
}
