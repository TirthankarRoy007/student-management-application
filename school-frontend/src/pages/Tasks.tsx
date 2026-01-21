import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../utils/storage";
import { getCurrentUser } from "../api/auth.api";
import { getStudentSubjects } from "../api/subjects.api";
import { getTasks, createTask, updateTask, logActivity, Task } from "../api/tasks.api";
import { User } from "../types/auth";

export default function Tasks() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    subjectId: "",
    title: "",
    estimatedMinutes: 30,
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmationTask, setConfirmationTask] = useState<Task | null>(null);

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
            const [subs, userTasks] = await Promise.all([
                getStudentSubjects(userData.id),
                getTasks()
            ]);
            setSubjects(subs);
            setTasks(userTasks);
            
            // Set default subject if available
            if (subs.length > 0 && !formData.subjectId) {
                setFormData(prev => ({ ...prev, subjectId: subs[0].subjectId }));
            }
        }
      } catch (error) {
        console.error("Failed to load data", error);
        // storage.clear();
        // navigate("/login");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      if (!formData.subjectId || !formData.title) {
          setToast({ message: "Please select a subject and enter a title", type: 'error' });
          return;
      }
      setIsSubmitting(true);
      try {
          const newTask = await createTask({
              subjectId: formData.subjectId,
              title: formData.title,
              estimatedMinutes: Number(formData.estimatedMinutes),
              description: formData.description
          });
          
          // Optimistic update
          const subject = subjects.find(s => s.subjectId === formData.subjectId)?.subject;
          const taskWithSubject = { ...newTask, subject };
          
          setTasks([taskWithSubject, ...tasks]);
          setFormData(prev => ({ ...prev, title: "", description: "" })); // Keep subject and time
          setToast({ message: "Task created successfully!", type: 'success' });
      } catch (error) {
          console.error("Failed to create task", error);
          setToast({ message: "Failed to create task", type: 'error' });
      } finally {
          setIsSubmitting(false);
      }
  };

  const confirmComplete = async () => {
      if (!confirmationTask) return;
      const task = confirmationTask;
      
      try {
          // 1. Update Task Status
          await updateTask(task.id, { status: 'completed' });
          
          // 2. Log Activity
          await logActivity({
              subjectId: task.subjectId,
              taskId: task.id,
              activityType: 'task_completed',
              minutesSpent: task.estimatedMinutes || 0,
              activityDate: new Date().setHours(0,0,0,0), // Start of day epoch
              activityTime: Date.now()
          });

          // 3. Update UI
          setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
          setToast({ message: "Task completed! Activity logged.", type: 'success' });
          
      } catch (error) {
          console.error("Failed to complete task", error);
          setToast({ message: "Something went wrong", type: 'error' });
      } finally {
          setConfirmationTask(null);
      }
  };

  const getInitials = (name: string) => {
    if(!name) return "U";
    const parts = name.split(" ");
    if(parts.length > 1) return parts[0][0] + parts[1][0];
    return name[0];
  };

  // Filter out completed tasks for the main view (optional, or show all with status)
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased font-display h-screen flex overflow-hidden">
       <style>
            {`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .task-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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

      {/* Confirmation Modal */}
      {confirmationTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4 text-[#111418] dark:text-white">Confirm Completion</h3>
                <p className="text-[#617589] dark:text-[#a0aec0] mb-6">
                    Mark this task as complete and log the time?
                </p>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={() => setConfirmationTask(null)} 
                        className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmComplete} 
                        className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Sidebar (Same as Dashboard) */}
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#137fec] text-white"
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
              Task Management
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
            {/* Page Title Section */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#111418] dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
                        Your Tasks
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                        <p className="text-[#617589] dark:text-gray-400 text-lg font-medium">
                            {activeTasks.length} tasks remaining
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#dbe0e6] dark:border-[#2d3a48] bg-white dark:bg-[#16222e] text-sm font-bold hover:bg-gray-50 transition-colors text-[#111418] dark:text-white">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filter
                    </button>
                </div>
            </div>

            {/* Create New Task Form */}
            <div className="bg-white dark:bg-[#16222e] border border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 mb-12 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#617589] dark:text-gray-500 mb-6">Create New Task</h3>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="w-full md:flex-1 min-w-[200px]">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Subject</label>
                        <select 
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-xl border-[#dbe0e6] dark:border-gray-600 bg-[#f0f2f4] dark:bg-gray-700 px-4 focus:ring-2 focus:ring-primary focus:outline-none text-[#111418] dark:text-white"
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects.map((sub: any) => (
                                <option key={sub.subject.id} value={sub.subject.id}>{sub.subject.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:flex-[2] min-w-[240px]">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Title</label>
                        <input 
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-xl border-[#dbe0e6] dark:border-gray-600 bg-[#f0f2f4] dark:bg-gray-700 px-4 focus:ring-2 focus:ring-primary focus:outline-none text-[#111418] dark:text-white"
                            placeholder="What needs to be done?"
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-bold text-[#111418] dark:text-gray-300 mb-2">Est. Mins</label>
                        <input 
                            type="number"
                            name="estimatedMinutes"
                            value={formData.estimatedMinutes}
                            onChange={handleInputChange}
                            className="w-full h-12 rounded-xl border-[#dbe0e6] dark:border-gray-600 bg-[#f0f2f4] dark:bg-gray-700 px-4 focus:ring-2 focus:ring-primary focus:outline-none text-[#111418] dark:text-white text-center font-bold"
                        />
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="h-12 px-8 w-full md:w-auto rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10 disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add Task"}
                    </button>
                </div>
            </div>

            {/* Task Grid */}
            <div className="task-grid">
                {loading ? (
                    <p>Loading tasks...</p>
                ) : activeTasks.length === 0 ? (
                    <div className="col-span-full text-center p-10 bg-white dark:bg-[#16222e] rounded-2xl border border-[#dbe0e6] dark:border-[#2d3a48]">
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">check_circle</span>
                        <p className="text-gray-500 font-medium">No active tasks! You're all caught up.</p>
                    </div>
                ) : (
                    activeTasks.map(task => (
                        <div 
                            key={task.id}
                            className="bg-white dark:bg-[#16222e] border border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all group border-t-4"
                            style={{ borderTopColor: task.subject?.color || '#137fec' }}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div 
                                        className="p-2.5 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${task.subject?.color || '#137fec'}20`, color: task.subject?.color || '#137fec' }}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {task.subject?.icon || 'menu_book'}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-[#f0f2f4] dark:bg-[#2d3a48] text-[#617589] dark:text-gray-400 text-xs font-bold rounded-full">
                                        {task.estimatedMinutes} mins
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2 leading-tight">
                                    {task.title}
                                </h3>
                                <p className="text-[#617589] dark:text-gray-400 text-sm mb-6 line-clamp-3">
                                    {task.description || `Task for ${task.subject?.name}`}
                                </p>
                            </div>
                            <button 
                                onClick={() => setConfirmationTask(task)}
                                className="w-full py-3 bg-[#e8f5ed] hover:bg-[#2a6f4d] text-[#2a6f4d] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Complete Task
                            </button>
                        </div>
                    ))
                )}

                {/* Quick Add Placeholder */}
                <button 
                    onClick={() => (document.querySelector('input[name="title"]') as HTMLInputElement)?.focus()}
                    className="border-2 border-dashed border-[#dbe0e6] dark:border-[#2d3a48] rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all group min-h-[280px]"
                >
                    <span className="material-symbols-outlined text-4xl mb-3 group-hover:scale-110 transition-transform">add_task</span>
                    <p className="font-bold text-sm">Quick Add Task</p>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
