import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { getCurrentUser, getStudents } from "../api/auth.api";
import { getSubjects, deleteSubject, enrollSubject, Subject } from "../api/subjects.api";
import { User } from "../types/auth";

type View = "overview" | "subjects" | "students";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>("overview");
  
  // Data State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [, setLoading] = useState(true);

  // Enroll Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
        const userData = await getCurrentUser();
        if (!userData || userData.role !== 'admin') {
            navigate("/dashboard");
            return;
        }
        setUser(userData);
        
        const [subjectsData, studentsData] = await Promise.all([
            getSubjects(),
            getStudents()
        ]);
        
        setSubjects(subjectsData.rows);
        setStudents(studentsData);
    } catch (error) {
        console.error("Failed to load admin data", error);
        storage.clear();
        navigate("/login");
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  const handleDeleteSubject = async (id: string) => {
    if(window.confirm("Are you sure you want to delete this subject?")) {
        try {
            await deleteSubject(id);
            setSubjects(subjects.filter(s => s.id !== id));
            setToast({ type: 'success', message: "Subject deleted successfully" });
        } catch (error) {
            console.error("Failed to delete subject", error);
            setToast({ type: 'error', message: "Failed to delete subject" });
        }
    }
  }

  const handleOpenEnroll = (student: User) => {
      setSelectedStudent(student);
      setSelectedSubjectId("");
      setIsEnrollModalOpen(true);
  }

  const submitEnrollment = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!selectedStudent || !selectedSubjectId) return;

      try {
          await enrollSubject(selectedStudent.id, selectedSubjectId);
          setToast({ type: 'success', message: `Successfully enrolled ${selectedStudent.name}` });
          setIsEnrollModalOpen(false);
      } catch (error: any) {
          console.error("Enrollment failed", error);
          setToast({ type: 'error', message: error.response?.data?.message || "Enrollment failed" });
      }
  }

  const getInitials = (name: string) => {
      if(!name) return "A";
      const parts = name.split(" ");
      if(parts.length > 1) return parts[0][0] + parts[1][0];
      return name[0];
  }

  const SidebarItem = ({ view, icon, label }: { view: View, icon: string, label: string }) => (
      <button
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === view ? 'bg-[#f0f2f4] dark:bg-[#2a2d32] text-primary' : 'text-[#617589] hover:bg-[#f0f2f4] dark:hover:bg-[#2a2d32]'}`}
      >
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
        <p className="text-sm font-semibold">{label}</p>
      </button>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased h-screen flex overflow-hidden font-display">
        {/* Toast Notification */}
        {toast && (
            <div className={`fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-[70] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
                <span className="font-medium">{toast.message}</span>
            </div>
        )}
        <style>
            {`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            `}
        </style>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#f0f2f4] dark:border-[#2a2d32] flex flex-col bg-white dark:bg-background-dark hidden md:flex">
        <div className="p-6 flex flex-col gap-8 h-full">
          <div className="flex items-center gap-3">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#111418] dark:text-white text-base font-bold leading-tight">EduAdmin</h1>
              <p className="text-[#617589] text-xs font-normal">Management System</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem view="overview" icon="dashboard" label="Overview" />
            <SidebarItem view="subjects" icon="menu_book" label="Manage Subjects" />
            <SidebarItem view="students" icon="group" label="Student Enrollments" />
          </nav>
          <div className="pt-4 border-t border-[#f0f2f4] dark:border-[#2a2d32]">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 bg-gray-200 flex items-center justify-center font-bold text-primary">
                  {getInitials(user?.name || "")}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[#111418] dark:text-white text-sm font-bold truncate">{user?.name || "Admin"}</p>
                <p className="text-[#617589] text-[11px] font-normal truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-[#f0f2f4] dark:border-[#2a2d32] px-8 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-[#111418] dark:text-white text-xl font-bold tracking-tight">Admin Console</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="size-10 flex items-center justify-center rounded-lg bg-[#f0f2f4] dark:bg-[#2a2d32] text-[#111418] dark:text-white hover:bg-[#e2e4e7] transition-colors" title="Logout">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          
          {/* OVERVIEW VIEW */}
          {currentView === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-[#dbe0e6] dark:border-[#2a2d32] flex flex-col gap-2 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-[#617589] text-sm font-medium">Total Students</p>
                    <span className="p-2 rounded-lg bg-primary/10 text-primary"><span className="material-symbols-outlined text-[20px]">groups</span></span>
                  </div>
                  <p className="text-[#111418] dark:text-white text-3xl font-extrabold tracking-tight">{students.length}</p>
                </div>
                <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-[#dbe0e6] dark:border-[#2a2d32] flex flex-col gap-2 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-[#617589] text-sm font-medium">Active Subjects</p>
                    <span className="p-2 rounded-lg bg-orange-100 text-orange-600"><span className="material-symbols-outlined text-[20px]">book</span></span>
                  </div>
                  <p className="text-[#111418] dark:text-white text-3xl font-extrabold tracking-tight">{subjects.length}</p>
                </div>
              </div>
          )}

          {/* SUBJECTS VIEW */}
          {currentView === "subjects" && (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                <h3 className="text-[#111418] dark:text-white text-lg font-bold">Subject Management</h3>
                <button onClick={() => navigate("/subjects")} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span> Add New Subject
                </button>
                </div>
                <div className="bg-white dark:bg-background-dark border border-[#dbe0e6] dark:border-[#2a2d32] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-[#f8fafc] dark:bg-[#1a1d21] border-b border-[#dbe0e6] dark:border-[#2a2d32]">
                        <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider">Created</th>
                        <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f4] dark:divide-[#2a2d32]">
                    {subjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1a1d21] transition-colors">
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="size-8 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: subject.color || '#137fec' }}>
                                    <span className="material-symbols-outlined text-sm">{subject.icon || 'menu_book'}</span>
                                </div>
                                <span className="text-[#111418] dark:text-white font-semibold">{subject.name}</span>
                            </td>
                            <td className="px-6 py-4 text-[#617589] text-sm">
                                {subject.createdAt ? new Date(Number(subject.createdAt)).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteSubject(subject.id)} className="p-2 text-[#617589] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
          )}

          {/* STUDENTS VIEW */}
          {currentView === "students" && (
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">Student Enrollments</h3>
                </div>
                <div className="bg-white dark:bg-background-dark border border-[#dbe0e6] dark:border-[#2a2d32] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[#f8fafc] dark:bg-[#1a1d21] border-b border-[#dbe0e6] dark:border-[#2a2d32]">
                            <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-[#617589] text-[13px] font-bold uppercase tracking-wider text-right">Enroll Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f2f4] dark:divide-[#2a2d32]">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1a1d21] transition-colors">
                                <td className="px-6 py-4 font-semibold text-[#111418] dark:text-white">{student.name}</td>
                                <td className="px-6 py-4 text-[#617589] text-sm">{student.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleOpenEnroll(student)}
                                        className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Enroll in Subject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
             </div>
          )}

        </div>
      </main>

      {/* Enroll Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4 text-[#111418] dark:text-white">Enroll {selectedStudent?.name}</h3>
                <form onSubmit={submitEnrollment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Subject</label>
                        <select 
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={() => setIsEnrollModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90">Confirm Enrollment</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}