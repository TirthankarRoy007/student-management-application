import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../utils/storage";
import { getCurrentUser } from "../api/auth.api";
import { getStudentSubjects } from "../api/subjects.api";
import { getGoals, createGoal, deleteGoal, Goal } from "../api/goals.api";
import { User } from "../types/auth";

export default function Goals() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    subjectId: "",
    targetType: "minutes" as "minutes" | "task_count",
    targetValue: 30
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toast]);

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
            // Fetch Subjects, Goals (backend now returns progress)
            const [subs, userGoals] = await Promise.all([
                getStudentSubjects(userData.id),
                getGoals()
            ]);
            setSubjects(subs);
            setGoals(userGoals);
            
            // Set default subject
            if (subs.length > 0 && !formData.subjectId) {
                setFormData(prev => ({ ...prev, subjectId: subs[0].subjectId }));
            }
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  const handleSubmit = async () => {
      if (!formData.subjectId) {
          setToast({ message: "Please select a subject", type: 'error' });
          return;
      }
      if (formData.targetValue <= 0) {
        setToast({ message: "Target must be greater than 0", type: 'error' });
        return;
      }

      setIsSubmitting(true);
      try {
          const newGoal = await createGoal({
              subjectId: formData.subjectId,
              targetType: formData.targetType,
              targetValue: Number(formData.targetValue)
          });
          
          // Optimistic update
          const subject = subjects.find(s => s.subjectId === formData.subjectId)?.subject;
          const goalWithSubject = { ...newGoal, subject, currentAmount: 0, progressPercentage: 0 };
          
          setGoals([goalWithSubject, ...goals]);
          setToast({ message: "Goal set successfully!", type: 'success' });
      } catch (error: any) {
          console.error("Failed to create goal", error);
          setToast({ message: error.response?.data?.message || "Failed to set goal", type: 'error' });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Remove this goal?")) return;
      try {
          await deleteGoal(id);
          setGoals(goals.filter(g => g.id !== id));
          setToast({ message: "Goal removed", type: 'success' });
      } catch (error) {
          setToast({ message: "Failed to remove goal", type: 'error' });
      }
  }

  const getInitials = (name: string) => {
    if(!name) return "U";
    const parts = name.split(" ");
    if(parts.length > 1) return parts[0][0] + parts[1][0];
    return name[0];
  };

  const completedGoalsCount = goals.filter(g => (g.progressPercentage || 0) >= 100).length;

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased font-display h-screen flex overflow-hidden">
       <style>
            {`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .bento-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            `}
        </style>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-[60]`}>
            <span className="material-symbols-outlined">
                {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
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
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111418] dark:text-[#a0aec0] hover:bg-[#f0f2f4] dark:hover:bg-[#2d3a48] transition-colors"
              to="/dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#137fec] text-white"
              to="/goals"
            >
              <span className="material-symbols-outlined">track_changes</span>
              <span className="text-sm font-medium">Goals</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-1">
             <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-medium">Sign Out</span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e] px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-[#111418] dark:text-white text-lg font-bold">
              Goal Tracking
            </h2>
          </div>
          <div className="flex items-center gap-3 pl-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#111418] dark:text-white leading-none">
                  {user?.name || "Student"}
                </p>
              </div>
              <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  {getInitials(user?.name || "")}
              </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-[1200px] mx-auto w-full">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111418] dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
                        My Daily Goals
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className={`flex h-2 w-2 rounded-full bg-primary ${loading ? 'animate-pulse' : ''}`}></span>
                        <p className="text-[#617589] dark:text-gray-400 text-lg font-medium">
                            {completedGoalsCount} of {goals.length} goals finished for today
                        </p>
                    </div>
                </div>
            </div>

            {/* Set New Goal Inline Form */}
            <div className="bg-white dark:bg-[#16222e] border border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 mb-12 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#617589] dark:text-gray-500 mb-6">Create New Goal</h3>
                <div className="flex flex-wrap items-end gap-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Subject</label>
                        <select 
                            value={formData.subjectId}
                            onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                            className="w-full h-12 rounded-xl border-[#dbe0e6] dark:border-gray-600 bg-[#f0f2f4] dark:bg-gray-700 px-4 focus:ring-2 focus:ring-primary focus:outline-none text-[#111418] dark:text-white"
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects.map((sub: any) => (
                                <option key={sub.subject.id} value={sub.subject.id}>{sub.subject.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Metric</label>
                        <div className="flex h-12 bg-[#f0f2f4] dark:bg-gray-700 p-1 rounded-xl">
                            <button 
                                onClick={() => setFormData({...formData, targetType: 'minutes'})}
                                className={`flex-1 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${formData.targetType === 'minutes' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary' : 'text-gray-500'}`}
                            >
                                Minutes
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, targetType: 'task_count'})}
                                className={`flex-1 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${formData.targetType === 'task_count' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary' : 'text-gray-500'}`}
                            >
                                Tasks
                            </button>
                        </div>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Target</label>
                        <input 
                            type="number" 
                            value={formData.targetValue}
                            onChange={(e) => setFormData({...formData, targetValue: Number(e.target.value)})}
                            className="w-full h-12 rounded-xl border-[#dbe0e6] dark:border-gray-600 bg-[#f0f2f4] dark:bg-gray-700 px-4 focus:ring-2 focus:ring-primary focus:outline-none text-[#111418] dark:text-white text-center font-bold"
                        />
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-12 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add to List"}
                    </button>
                </div>
            </div>

            {/* Goal Grid (Bento Style) */}
            <div className="bento-grid">
                {goals.map(goal => {
                    const progressPercent = goal.progressPercentage || 0;
                    const isCompleted = progressPercent >= 100;
                    
                    return (
                        <div 
                            key={goal.id} 
                            className={`bg-white dark:bg-[#16222e] border-l-4 border border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden ${isCompleted ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
                            style={{ borderLeftColor: goal.subject?.color || '#137fec' }}
                        >
                            {isCompleted && (
                                <div className="absolute -right-4 -top-4 text-primary/10">
                                    <span className="material-symbols-outlined text-8xl">check_circle</span>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div 
                                    className="p-3 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${goal.subject?.color || '#137fec'}20`, color: goal.subject?.color || '#137fec' }}
                                >
                                    <span className="material-symbols-outlined text-2xl">
                                        {goal.subject?.icon || 'track_changes'}
                                    </span>
                                </div>
                                {!goal.isVirtual && (
                                    <button onClick={() => handleDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors z-10">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                            </div>
                            
                            <div>
                                <h4 className="text-[#617589] dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                                    {goal.subject?.name}
                                </h4>
                                <p className="text-2xl font-black text-[#111418] dark:text-white">
                                    {goal.targetValue} {goal.targetType === 'minutes' ? 'minutes' : 'Tasks'}
                                </p>
                                <p className="text-sm text-[#617589] dark:text-gray-400 mt-1 font-medium">
                                    {goal.currentAmount} / {goal.targetValue} {goal.targetType === 'minutes' ? 'min' : 'completed'}
                                </p>
                            </div>

                            <div className="mt-8 z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-[#617589] dark:text-gray-500">
                                        {isCompleted ? 'Goal Reached' : 'Progress'}
                                    </span>
                                    <span 
                                        className="text-xs font-bold"
                                        style={{ color: goal.subject?.color || '#137fec' }}
                                    >
                                        {progressPercent}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-[#f0f2f4] dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-500" 
                                        style={{ 
                                            width: `${progressPercent}%`, 
                                            backgroundColor: goal.subject?.color || '#137fec' 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty "New" Slot Placeholder */}
                {goals.length === 0 && (
                    <button 
                        onClick={() => document.querySelector('select')?.focus()}
                        className="border-2 border-dashed border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all group min-h-[220px]"
                    >
                        <span className="material-symbols-outlined text-4xl mb-3 group-hover:scale-110 transition-transform">add_circle</span>
                        <p className="font-bold text-sm">Add Your First Goal</p>
                    </button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}