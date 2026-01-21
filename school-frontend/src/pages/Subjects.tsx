import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSubjects, createSubject, updateSubject, enrollSubject, getStudentSubjects, Subject } from "../api/subjects.api";
import { getCurrentUser, updateUser } from "../api/auth.api";
import { User } from "../types/auth";
import { storage } from "../utils/storage";

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrolledSubjectIds, setEnrolledSubjectIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null); // Track which subject is being enrolled
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Profile Dropdown & Settings Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({ name: "", email: "" });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      
      const [subjectsData, enrolledData] = await Promise.all([
          getSubjects(),
          userData ? getStudentSubjects(userData.id) : Promise.resolve([])
      ]);

      // Backend returns { count, rows } for subjects
      setSubjects(subjectsData.rows);
      
      // Map enrolled subjects to a Set of IDs
      // Assuming enrolledData is an array of UserSubject objects with a subjectId property
      const ids = new Set(enrolledData.map((item: any) => item.subjectId));
      setEnrolledSubjectIds(ids);

    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  const handleOpenSettings = () => {
      if (user) {
          setUpdateFormData({ name: user.name, email: user.email });
          setIsSettingsModalOpen(true);
          setIsProfileOpen(false);
      }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setUpdateLoading(true);
      try {
          const updatedUser = await updateUser(updateFormData);
          setUser(updatedUser);
          setIsSettingsModalOpen(false);
          setToast({ type: 'success', message: "Profile updated successfully!" });
      } catch (error: any) {
          console.error("Failed to update profile", error);
          setToast({ type: 'error', message: error.response?.data?.message || "Failed to update profile" });
      } finally {
          setUpdateLoading(false);
      }
  };

  const handleEnroll = async (subjectId: string) => {
    if (!user) return;
    setEnrolling(subjectId);
    try {
        await enrollSubject(user.id, subjectId);
        setToast({ type: 'success', message: "Successfully enrolled in subject!" });
        setEnrolledSubjectIds(prev => new Set(prev).add(subjectId));
    } catch (error: any) {
        console.error("Enrollment failed", error);
        setToast({ type: 'error', message: error.response?.data?.message || "Failed to enroll in subject." });
    } finally {
        setEnrolling(null);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentSubject({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setIsEditMode(true);
    setCurrentSubject({ ...subject });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && currentSubject.id) {
        await updateSubject(currentSubject.id, {
            name: currentSubject.name,
            color: currentSubject.color,
            icon: currentSubject.icon
        });
      } else {
        await createSubject({
            name: currentSubject.name!,
            color: currentSubject.color,
            icon: currentSubject.icon
        });
      }
      setIsModalOpen(false);
      setToast({ type: 'success', message: isEditMode ? "Subject updated successfully!" : "Subject created successfully!" });
      loadData(); // Refresh list
    } catch (error) {
      console.error("Failed to save subject", error);
      setToast({ type: 'error', message: "Failed to save subject. Ensure you have admin privileges." });
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white min-h-screen font-display">
        {/* Toast Notification */}
        {toast && (
            <div className={`fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce z-[70] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
                <span className="font-medium">{toast.message}</span>
            </div>
        )}
      <div className="flex h-screen overflow-hidden">
        {/* Reuse SideNav from Dashboard if possible, or just use the Header as per design provided for Subjects page */}
         {/* The design provided has a specific top nav and no side nav shown, but user said "redirect to subject listing page". 
             I'll stick to the layout provided in the new design HTML (Top Nav only) for consistency with the design snippet, 
             or reuse the Dashboard layout?
             The Dashboard design had a SideNav. The Subjects design has a different TopNav.
             I will use the Layout from the Subjects Design HTML.
         */}
         
         <div className="layout-container flex h-full grow flex-col overflow-y-auto">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-gray-800 px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">school</span>
                        </div>
                        <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">School Management</h2>
                    </div>
                    <div className="flex items-center gap-9 hidden md:flex">
                        <Link className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
                        <Link className="text-primary text-sm font-bold leading-normal border-b-2 border-primary pb-1" to="/subjects">Subjects</Link>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-4 items-center">
                    {/* Add Subject Button (Admin Only) */}
                    {user?.role === 'admin' && (
                        <button 
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span className="hidden sm:inline">Add Subject</span>
                        </button>
                    )}
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 bg-gray-200 flex items-center justify-center font-bold text-primary hover:ring-2 hover:ring-primary/20 transition-all"
                        >
                            {user?.name ? user.name[0] : 'U'}
                        </button>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 overflow-hidden">
                                    <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Logged in as</p>
                                        <p className="text-sm font-bold text-[#111418] dark:text-white truncate">{user?.name}</p>
                                    </div>
                                    <button 
                                        onClick={handleOpenSettings}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">settings</span>
                                        Update Profile
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex flex-1 justify-center py-8 px-4 overflow-y-auto">
                <div className="flex flex-col max-w-[1200px] flex-1">
                    {/* Headline & Subtext */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div className="flex flex-col">
                            <h1 className="text-[#111418] dark:text-white tracking-tight text-[32px] font-bold leading-tight">My Learning</h1>
                            <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">Browse and manage your academic subjects for the current semester.</p>
                        </div>
                    </div>

                    {/* SearchBar */}
                    <div className="mb-8">
                        <label className="flex flex-col min-w-40 h-14 w-full max-w-2xl">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="text-[#617589] flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-xl">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input 
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-[#111418] dark:text-white focus:outline-0 border-none bg-white dark:bg-gray-800 placeholder:text-[#617589] px-4 text-base font-normal leading-normal" 
                                    placeholder="Search for subjects..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </label>
                    </div>

                    {/* Subjects Grid */}
                    {loading ? (
                         <div className="flex justify-center p-10"><p>Loading subjects...</p></div>
                    ) : filteredSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSubjects.map((subject) => (
                                <div key={subject.id} className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-[#f0f2f4] dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className={`h-32 w-full flex items-center justify-center relative overflow-hidden`} style={{ background: subject.color || 'linear-gradient(135deg, #137fec, #4facfe)' }}>
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                        <span className="material-symbols-outlined text-white text-5xl opacity-90">{subject.icon || 'menu_book'}</span>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight mb-1">{subject.name}</h3>
                                        <p className="text-[#617589] dark:text-gray-400 text-sm font-medium mb-1">Code: {subject.id.substring(0, 6).toUpperCase()}</p>
                                        
                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            {enrolledSubjectIds.has(subject.id) ? (
                                                <button 
                                                    disabled
                                                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-600 px-3 py-2 rounded-lg text-sm font-bold cursor-default"
                                                >
                                                    <span className="material-symbols-outlined text-sm">check_circle</span> Enrolled
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEnroll(subject.id)}
                                                    disabled={enrolling === subject.id}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span> {enrolling === subject.id ? "Enrolling..." : "Enroll"}
                                                </button>
                                            )}
                                             {user?.role === 'admin' && (
                                                <button 
                                                    onClick={() => handleOpenEdit(subject)}
                                                    className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                             )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">No subjects found</h2>
                            <p className="text-[#617589] dark:text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                            <button onClick={() => setSearch("")} className="mt-6 text-primary font-bold hover:underline">Clear search</button>
                        </div>
                    )}
                </div>
            </main>
         </div>

         {/* Subject Modal */}
         {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#111418] dark:text-white">{isEditMode ? "Update Subject" : "Add New Subject"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                                value={currentSubject.name || ""}
                                onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color (Hex/Gradient)</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                                placeholder="#137fec or linear-gradient(...)"
                                value={currentSubject.color || ""}
                                onChange={(e) => setCurrentSubject({...currentSubject, color: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (Material Symbol Name)</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2"
                                placeholder="menu_book"
                                value={currentSubject.icon || ""}
                                onChange={(e) => setCurrentSubject({...currentSubject, icon: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
                            >
                                {isEditMode ? "Save Changes" : "Create Subject"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
         )}

         {/* Settings Modal */}
         {isSettingsModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
    </div>
  );
}
