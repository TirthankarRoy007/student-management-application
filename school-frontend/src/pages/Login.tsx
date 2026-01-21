import { useState } from "react";
import { login } from "../api/auth.api";
import { storage } from "../utils/storage";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      storage.setToken(data.token);
      if (data.user.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <Header />

      {/* Main Content: Split Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Hero Illustration */}
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 login-illustration bg-cover bg-center relative p-12 items-end">
          <div className="relative z-10 text-white max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-4 drop-shadow-md">
              Empowering Your Academic Journey
            </h1>
            <p className="text-lg font-medium opacity-90 mb-8 leading-relaxed">
              Access your personalized dashboard, track your learning progress, and stay connected with your educators all in one place.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-white text-sm">check_circle</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Courses</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-white text-sm">check_circle</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Grades</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-white text-sm">check_circle</span>
                <span className="text-xs font-semibold uppercase tracking-wider">Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-md">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">Welcome Back to EduTrack</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Your academic journey continues here. Please sign in to access your personalized dashboard, track your learning progress, and connect with your educators.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                icon="mail"
                placeholder="name@student.edu"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                icon="lock"
                placeholder="••••••••"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Options Row */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input className="rounded text-primary focus:ring-primary/50 size-4 border-gray-300 dark:border-gray-700 dark:bg-background-dark" type="checkbox"/>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">Remember me</span>
                </label>
                <Link className="text-sm font-bold text-primary hover:underline" to="/forgot-password">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                loadingText="Signing In..."
                fullWidth
                className="mt-6"
              >
                Sign In to Dashboard
              </Button>
            </form>

            {/* Footer CTA */}
            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-[#111418] dark:text-gray-400 text-sm font-normal">
                New to the school system? 
                <Link className="text-primary font-bold hover:underline ml-1" to="/register">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
