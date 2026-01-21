import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../utils/storage";
import { getCurrentUser, updateUser } from "../api/auth.api";
import { getStudentSubjects } from "../api/subjects.api";
import { getGoals, Goal } from "../api/goals.api";
import { User } from "../types/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState<any[]>([]); // Array of UserSubject objects
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({ name: "", email: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
        const timer = setTimeout(() => setToastMessage(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const userData = await getCurrentUser();
            if (userData.role === 'admin') {
                navigate("/admin-dashboard");
                return;
            }
            setUser(userData);
            
            if (userData.id) {
                const [subjects, userGoals] = await Promise.all([
                    getStudentSubjects(userData.id),
                    getGoals()
                ]);
                setEnrolledSubjects(subjects);
                setGoals(userGoals);
            }
        } catch (error) {
            console.error("Failed to load user data", error);
             storage.clear();
             navigate("/login");
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  const handleOpenSettings = () => {
      if (user) {
          setUpdateFormData({ name: user.name, email: user.email });
          setIsSettingsModalOpen(true);
      }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setUpdateLoading(true);
      try {
          const updatedUser = await updateUser(updateFormData);
          setUser(updatedUser);
          setIsSettingsModalOpen(false);
          setToastMessage("Profile updated successfully!");
      } catch (error: any) {
          console.error("Failed to update profile", error);
          alert(error.response?.data?.message || "Failed to update profile");
      } finally {
          setUpdateLoading(false);
      }
  };

  const getInitials = (name: string) => {
      if(!name) return "U";
      const parts = name.split(" ");
      if(parts.length > 1) return parts[0][0] + parts[1][0];
      return name[0];
  }

  // Calculate Stats
  const activeGoalsCount = goals.length;
  const completedGoalsCount = goals.filter(g => (g.progressPercentage || 0) >= 100).length;
  // Mocking GPA/Study Hours for now as backend doesn't provide them yet, 
  // but replacing static hardcoded lists with real data.
  
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased font-display h-screen flex overflow-hidden">
        {/* ... (Existing styles and Sidebar) ... */}
        <style>
            {`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .active-nav {
                background-color: #137fec;
                color: white !important;
            }
            `}
        </style>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-[60]">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-medium">{toastMessage}</span>
        </div>
      )}
      <aside className="w-64 border-r border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e] flex flex-col justify-between p-4 hidden md:flex">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                school
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#111418] dark:text-white text-base font-bold leading-none">
                EduManager
              </h1>
              <p className="text-[#617589] dark:text-[#a0aec0] text-xs font-normal">
                Student Portal
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg active-nav"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors"
              to="/subjects"
            >
              <span className="material-symbols-outlined">book_5</span>
              <span className="text-sm font-medium">Subjects</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors"
              to="/tasks"
            >
              <span className="material-symbols-outlined">task_alt</span>
              <span className="text-sm font-medium">Tasks</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors"
              to="/goals"
            >
              <span className="material-symbols-outlined">track_changes</span>
              <span className="text-sm font-medium">Goals</span>
            </Link>
            <button
              onClick={handleOpenSettings}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </nav>
        </div>
        <div className="flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">help_center</span>
            <span className="text-sm font-medium">Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e] px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-[#111418] dark:text-white text-lg font-bold">
              Dashboard Overview
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-[#f0f2f4] dark:bg-[#2d3a48] text-[#111418] dark:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#dbe0e6] dark:border-[#2d3a48]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#111418] dark:text-white leading-none">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-[#617589] dark:text-[#a0aec0]">
                  {user?.role === 'student' ? 'Student' : 'User'}
                </p>
              </div>
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-primary flex items-center justify-center bg-gray-200 text-primary font-bold"
              >
                  {getInitials(user?.name || "")}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
            </h1>
            <p className="text-[#617589] dark:text-[#a0aec0] text-base">
              Ready to crush your goals today?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e]">
              <div className="flex items-center justify-between">
                <p className="text-[#617589] dark:text-[#a0aec0] text-sm font-medium">
                  Active Goals
                </p>
                <span className="material-symbols-outlined text-primary">
                  track_changes
                </span>
              </div>
              <p className="text-[#111418] dark:text-white text-3xl font-bold">
                {activeGoalsCount}
              </p>
              <p className="text-[#617589] dark:text-[#a0aec0] text-xs">
                {completedGoalsCount} completed today
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e]">
              <div className="flex items-center justify-between">
                <p className="text-[#617589] dark:text-[#a0aec0] text-sm font-medium">
                  Enrolled Subjects
                </p>
                <span className="material-symbols-outlined text-primary">
                  book_5
                </span>
              </div>
              <p className="text-[#111418] dark:text-white text-3xl font-bold">
                {enrolledSubjects.length}
              </p>
              <p className="text-[#617589] dark:text-[#a0aec0] text-xs">
                Active this semester
              </p>
            </div>
            {/* Placeholder for future stat or remove if strictly no static */}
             <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e]">
              <div className="flex items-center justify-between">
                <p className="text-[#617589] dark:text-[#a0aec0] text-sm font-medium">
                  Tasks Finished
                </p>
                <span className="material-symbols-outlined text-green-500">
                  check_circle
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                 {/* This would ideally come from API too */}
                <p className="text-[#111418] dark:text-white text-3xl font-bold">
                  {goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0)}
                </p>
                <p className="text-[#078838] text-xs font-bold leading-normal">
                  Across all subjects
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Subjects (Left 2/3) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                  Enrolled Subjects
                </h2>
                <Link to="/subjects" className="text-primary text-sm font-bold hover:underline">
                  View All / Enroll
                </Link>
              </div>
              
              {loading ? (
                  <div className="p-10 text-center"><p>Loading enrolled subjects...</p></div>
              ) : enrolledSubjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledSubjects.map((item) => {
                        const subject = item.subject;
                        return (
                            <div key={subject.id} className="bg-white dark:bg-[#16222e] rounded-xl border-t-4 border-x border-b border-[#dbe0e6] dark:border-x-[#2d3a48] dark:border-b-[#2d3a48] p-5 shadow-sm hover:shadow-md transition-shadow" style={{ borderTopColor: subject.color || '#137fec' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${subject.color}20`, color: subject.color || '#137fec' }}>
                                <span className="material-symbols-outlined">
                                    {subject.icon || 'menu_book'}
                                </span>
                                </div>
                                <span className="bg-[#f0f2f4] dark:bg-[#2d3a48] text-xs font-bold px-2 py-1 rounded">
                                Active
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-1">
                                {subject.name}
                            </h3>
                            <p className="text-[#617589] dark:text-[#a0aec0] text-sm mb-4">
                                Joined: {new Date(Number(item.createdAt)).toLocaleDateString()}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <button className="font-bold text-xs flex items-center gap-1" style={{ color: subject.color || '#137fec' }}>
                                DETAILS <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                            </div>
                            </div>
                        );
                    })}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-[#16222e] rounded-xl border border-[#dbe0e6] dark:border-[#2d3a48]">
                      <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">library_books</span>
                      <p className="text-gray-500 font-medium">You haven't enrolled in any subjects yet.</p>
                      <Link to="/subjects" className="mt-4 text-primary font-bold hover:underline">Browse Subjects</Link>
                  </div>
              )}
            </div>

            {/* Daily Goals Section (Right 1/3) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                  Daily Goals
                </h2>
                <Link to="/goals" className="text-primary p-1 hover:bg-primary/10 rounded-full transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </Link>
              </div>
              
              {goals.length > 0 ? (
                  <div className="bg-white dark:bg-[#16222e] rounded-xl border border-[#dbe0e6] dark:border-[#2d3a48] p-6 shadow-sm space-y-6">
                    {goals.slice(0, 3).map((goal) => (
                        <div key={goal.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                            <p className="text-sm font-bold text-[#111418] dark:text-white">
                                {goal.subject?.name}
                            </p>
                            <p className="text-xs text-[#617589] dark:text-[#a0aec0]">
                                Goal: {goal.targetValue} {goal.targetType === 'minutes' ? 'min' : 'tasks'}
                            </p>
                            </div>
                            <p className="text-xs font-bold" style={{ color: goal.subject?.color || '#137fec' }}>
                                {goal.currentAmount || 0}/{goal.targetValue}
                            </p>
                        </div>
                        <div className="w-full bg-[#f0f2f4] dark:bg-[#2d3a48] rounded-full h-2">
                            <div
                            className="h-2 rounded-full transition-all"
                            style={{ 
                                width: `${Math.min(goal.progressPercentage || 0, 100)}%`,
                                backgroundColor: goal.subject?.color || '#137fec'
                            }}
                            ></div>
                        </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-[#f0f2f4] dark:border-[#2d3a48]">
                    <p className="text-center text-sm font-medium text-[#617589] dark:text-[#a0aec0]">
                        You're doing great!{" "}
                        <span className="text-[#111418] dark:text-white font-bold">
                        {completedGoalsCount} of {activeGoalsCount}
                        </span>{" "}
                        daily goals completed.
                    </p>
                    </div>
                </div>
              ) : (
                  <div className="bg-white dark:bg-[#16222e] rounded-xl border border-[#dbe0e6] dark:border-[#2d3a48] p-6 shadow-sm text-center">
                      <p className="text-gray-500 text-sm">No goals set for today.</p>
                      <Link to="/goals" className="text-primary text-sm font-bold hover:underline mt-2 block">Create a Goal</Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4 text-[#111418] dark:text-white">Update Profile</h3>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                            value={updateFormData.name}
                            onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                            value={updateFormData.email}
                            onChange={(e) => setUpdateFormData({...updateFormData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsSettingsModalOpen(false)} 
                            className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={updateLoading}
                            className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-70"
                        >
                            {updateLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}