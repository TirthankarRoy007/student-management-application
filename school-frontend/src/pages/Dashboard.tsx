import { useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              School Management System
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Students
              </h2>
              <p className="text-gray-500">Manage student records</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Teachers
              </h2>
              <p className="text-gray-500">Manage teacher information</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Classes
              </h2>
              <p className="text-gray-500">View and manage classes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
