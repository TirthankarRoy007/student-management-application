import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth.api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
        setError("Missing reset token.");
        return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      // Redirect after a short delay or just show success message
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
     if (!password) return { percentage: 0, color: 'bg-gray-100', label: 'Empty' };
     if (password.length < 6) return { percentage: 25, color: 'bg-red-500', label: 'Weak' };
     if (password.length < 10) return { percentage: 60, color: 'bg-yellow-400', label: 'Medium' };
     return { percentage: 100, color: 'bg-green-500', label: 'Strong' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
       {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-gray-800 px-10 py-3 bg-white dark:bg-background-dark z-10">
        <div className="flex items-center gap-4 text-[#111418] dark:text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-3xl">auto_stories</span>
          </div>
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            EduTracker
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a
              className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#"
            >
              Courses
            </a>
            <a
              className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#"
            >
              Grades
            </a>
          </div>
          <Link
             to="/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all"
          >
            <span>Login</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <style>
            {`
            .knowledge-bar-glow {
                box-shadow: 0 0 15px rgba(19, 127, 236, 0.3);
            }
            .illustration-gradient {
                background: radial-gradient(circle at center, rgba(19, 127, 236, 0.15) 0%, transparent 70%);
            }
            `}
        </style>
        {/* Left Side: Creative Illustration Area */}
        <div className="hidden lg:flex flex-1 relative bg-white dark:bg-background-dark items-center justify-center p-12 overflow-hidden border-r border-gray-100 dark:border-gray-800">
          <div className="absolute inset-0 illustration-gradient"></div>
          <div className="relative z-10 max-w-lg text-center">
            <div className="mb-8 relative inline-block">
              {/* Symbolic 'Rebooting Knowledge' Illustration */}
              <div className="w-80 h-80 bg-primary/5 rounded-full flex items-center justify-center border-4 border-dashed border-primary/20 animate-pulse">
                <div className="w-64 h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
                  <span
                    className="material-symbols-outlined text-[120px] text-primary transition-transform group-hover:scale-110 duration-500"
                    style={{
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48",
                    }}
                  >
                    menu_book
                  </span>
                  {/* Glowing Effect */}
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full blur-3xl opacity-40"></div>
                </div>
              </div>
              {/* Student Figure Placeholder Icon */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-700 p-4 rounded-full shadow-xl border border-gray-100 dark:border-gray-600">
                <span className="material-symbols-outlined text-primary text-4xl">
                  person_search
                </span>
              </div>
              {/* Key/Lock Icon */}
              <div className="absolute -top-4 -right-4 bg-primary p-4 rounded-full shadow-xl">
                <span className="material-symbols-outlined text-white text-4xl">
                  vpn_key
                </span>
              </div>
            </div>
            <h1 className="text-[#111418] dark:text-white text-[32px] font-bold leading-tight mb-4">
              Secure Your Knowledge
            </h1>
            <p className="text-[#617589] dark:text-gray-400 text-lg leading-relaxed px-10">
              Your learning progress is your greatest asset. Create a strong
              password to keep your academic journey private and safe.
            </p>
          </div>
        </div>

        {/* Right Side: Reset Password Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-[480px]">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                  Reset Password
                </h2>
                <p className="text-[#617589] dark:text-gray-400 text-sm">
                  Please choose a complex password to protect your account.
                </p>
              </div>

               {/* Messages */}
               {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                    {error}
                </div>
                )}
                {success && (
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg mb-6">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    verified
                    </span>
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Password updated successfully! Redirecting to login...
                    </span>
                </div>
                )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* New Password Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#111418] dark:text-gray-200 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 px-4 pr-12 text-[#111418] dark:text-white placeholder:text-[#617589] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-4 text-[#617589] hover:text-primary transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Knowledge Bar (Password Strength Meter) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary/80">
                      Knowledge Bar
                    </span>
                    <span className={`text-xs font-medium ${strength.percentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden knowledge-bar-glow">
                    {/* Bar state */}
                    <div
                      className={`h-full transition-all duration-500 ${strength.color}`}
                      style={{ width: `${strength.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-[#617589] dark:text-gray-500 italic">
                    Pro tip: Use symbols and numbers for a "Fully Charged" secure
                    account.
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[#111418] dark:text-gray-200 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-14 px-4 pr-12 text-[#111418] dark:text-white placeholder:text-[#617589] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {confirmPassword && password === confirmPassword && (
                        <button
                        className="absolute right-4 text-green-500"
                        type="button"
                        >
                        <span className="material-symbols-outlined">
                            check_circle
                        </span>
                        </button>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading || success}
                >
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                  {!loading && (
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                        lock_reset
                    </span>
                  )}
                </button>
                <div className="text-center pt-4">
                  <Link
                    className="text-sm font-medium text-primary hover:underline transition-all"
                    to="/login"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
            {/* Footer / Support */}
            <p className="text-center mt-8 text-[#617589] dark:text-gray-500 text-xs">
              Need help?{" "}
              <a className="underline" href="#">
                Contact School Support
              </a>
              <br />© 2024 EduTracker Learning Systems.
            </p>
          </div>
        </div>
      </main>

      {/* Optional Visual Decoration: Large Glowing Circles in background */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
}
