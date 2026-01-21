import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccessMessage("If an account exists with this email, you will receive a password reset link shortly.");
      // Optional: Navigate away after a delay? Or just let them sit there.
      // navigate("/login"); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      {/* TopNavBar Component */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f3f4] dark:border-[#3a3f44] px-10 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#121617] dark:text-white">
          <div className="size-6 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                fillRule="evenodd"
              ></path>
              <path
                clipRule="evenodd"
                d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            EduTrack
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <div className="hidden md:flex items-center gap-9">
            <Link
              className="text-[#121617] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
              to="/login"
            >
              Login
            </Link>
            <a
              className="text-[#121617] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Help
            </a>
            <a
              className="text-[#121617] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              About
            </a>
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all">
            Contact Support
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-stretch overflow-hidden magic-bg relative">
         <style>
          {`
            .soft-glow {
              box-shadow: 0 10px 40px -10px rgba(82, 201, 224, 0.15);
            }
            .magic-bg {
              background: radial-gradient(circle at 10% 20%, rgba(82, 201, 224, 0.1) 0%, transparent 40%),
                          radial-gradient(circle at 90% 80%, rgba(255, 199, 178, 0.1) 0%, transparent 40%);
            }
          `}
        </style>
        {/* Split Layout - Left Side (Illustration) */}
        <div className="hidden lg:flex w-7/12 flex-col justify-center items-center p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-coral/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 w-full max-w-xl">
            {/* ImageGrid Styled as Custom Illustration Container */}
            <div className="rounded-3xl p-8 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 soft-glow">
              <div
                className="aspect-square bg-center bg-no-repeat bg-contain mb-6"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKH2tfMgE4FdVBWkbusQSCgUdXzHtikWRxHUwuAyfNAJkj6WELBroFa-PI7m9PQBWTpo3Qpb4q55YQOF4LZ13s_4sOVn9p2Qc79VrvE909L3anOeB5C4qAuK-0uZsNJLsB_VTzNG3hFKBS039Bq0-pz91ASvrBzKvOIDPqJuiOghIrus8gDgBoyKbIssNSO6X9hJv4KkJZpv3T-_3sy8GNu_obNrstwus5SIAm5v6lLgNP3hFmn-zktHadrUYoSHkk9hbJk4nuMh9p")',
                }}
              ></div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#121617] dark:text-white mb-3">
                  Exploring the Archives?
                </h3>
                <p className="text-[#658086] dark:text-gray-400 text-lg leading-relaxed">
                  Let's find those credentials tucked away in the digital shelves.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Split Layout - Right Side (Form) */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center px-6 md:px-12 py-12">
          <div className="w-full max-w-[440px] flex flex-col gap-6">
            {/* SectionHeader Component */}
            <div className="text-left">
              <h2 className="text-[#121617] dark:text-white text-4xl font-extrabold leading-tight tracking-[-0.02em] mb-4">
                Lost your way?
              </h2>
              {/* BodyText Component */}
              <p className="text-[#658086] dark:text-gray-400 text-lg font-normal leading-relaxed">
                Don't worry, it happens to the best of us. Enter your school
                email and we'll send a magic link to get you back to class.
              </p>
            </div>
            
            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white dark:bg-background-dark/50 p-8 rounded-xl soft-glow border border-[#f0f3f4] dark:border-white/10">
              {/* TextField Component */}
              <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[#121617] dark:text-white text-sm font-semibold uppercase tracking-wider">
                    School Email Address
                  </span>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      mail
                    </span>
                    <input
                      className="form-input flex w-full rounded-xl text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dce3e5] dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary h-14 pl-12 placeholder:text-[#658086] text-base font-normal transition-all"
                      placeholder="e.g. student@school.edu"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              {/* Action Button */}
              <button
                className="flex w-full items-center justify-center gap-3 rounded-xl h-14 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span className="truncate">{loading ? "Sending..." : "Send Magic Link"}</span>
                {!loading && (
                    <span
                    className="material-symbols-outlined text-accent-coral animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                    auto_awesome
                    </span>
                )}
              </button>
              {/* Back to Login */}
              <div className="text-center">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#658086] dark:text-gray-400 hover:text-primary transition-colors"
                  to="/login"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  Back to Login
                </Link>
              </div>
            </form>
            {/* Help Link (Mobile/Small Desktop) */}
            <div className="flex justify-center gap-4 lg:hidden">
              <p className="text-sm text-[#658086] dark:text-gray-500">
                Need more help?{" "}
                <a className="text-primary font-medium" href="#">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer - Subtle */}
      <footer className="p-6 text-center lg:text-right lg:px-12 border-t border-[#f0f3f4] dark:border-white/5 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm">
        <p className="text-xs text-[#658086] dark:text-gray-500 uppercase tracking-widest font-semibold">
          © 2024 EduTrack Platform. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
