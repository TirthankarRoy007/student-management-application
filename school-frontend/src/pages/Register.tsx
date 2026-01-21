import React, { useState } from "react";
import { register } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await register({ name: username, email, password });
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: "None", count: 0 };
    if (password.length <= 5) return { label: "Weak", count: 1 };
    if (password.length <= 8) return { label: "Medium", count: 2 };
    return { label: "Strong", count: 4 };
  };

  const strength = getPasswordStrength();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-stretch font-display">
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* Left Side: Hero Illustration (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
          </div>
          <div className="relative z-10 max-w-lg text-center">
            <div
              className="w-full aspect-square bg-cover bg-center rounded-2xl mb-8 shadow-2xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHqJWPOYjKX0UOiKf3WoCo1kD9AzJ_Pf39tkLQecu_HPDYfQJRhz5NHD8J8KwNnPSoRtvGplObeA-kRH2COwsd3pCpB6gAz7lGBkWqATAI9CIdoL3-dnJlisSyJ3b43ssjpDs28KQMON-DA4KCdZ9DAQYfxv2iO31Iz9KUAnP7XxIbuYTbgxIM5UOtq-sBCz1MnhweeNa7S53HRFuICbcjfGyWOezz4rYlBzn_1LocB_vgqKb0pVc-IXT9jscZXK8GYUBsNJngTjlK")',
              }}
            ></div>
            <h2 className="text-white text-4xl font-extrabold leading-tight mb-4">
              Empowering the next generation of leaders.
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of students managing their academic journey with our integrated platform.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-[440px] space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-[#111418] dark:text-white">EduStream</span>
              </div>
              <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold leading-tight">
                Create Account
              </h1>
              <p className="text-[#617589] dark:text-gray-400 text-base">Enter your details to register as a student.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="flex flex-col gap-2">
                <p className="text-[#111418] dark:text-gray-200 text-sm font-semibold leading-normal">Username</p>
                <div className="relative">
                  <input
                    className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617589] px-4 text-base font-normal transition-all"
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <p className="text-[#111418] dark:text-gray-200 text-sm font-semibold leading-normal">Email Address</p>
                <div className="relative">
                  <input
                    className="form-input flex w-full rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617589] px-4 text-base font-normal transition-all"
                    placeholder="student@school.edu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <p className="text-[#111418] dark:text-gray-200 text-sm font-semibold leading-normal">Password</p>
                <div className="relative flex w-full items-stretch">
                  <input
                    className="form-input flex w-full min-w-0 flex-1 rounded-l-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617589] px-4 border-r-0 text-base font-normal transition-all"
                    placeholder="Min. 8 characters"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div 
                    className="text-[#617589] flex border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center px-3 rounded-r-lg border-l-0 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined hover:text-primary transition-colors">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
                {/* Password Strength Indicator */}
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`flex-1 rounded-full ${i <= strength.count ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-primary font-medium">Strength: {strength.label}</p>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <input
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label className="text-sm text-[#617589] dark:text-gray-400 leading-snug cursor-pointer" htmlFor="terms">
                  I agree to the{" "}
                  <a className="text-primary hover:underline" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-[#617589] dark:text-gray-400 text-sm">
                Already have an account?
                <Link to="/login" className="text-primary font-bold hover:underline ml-1 transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}