import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const { isSidebarOpen, closeSidebar } = useUIStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden transition-colors duration-700">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-7xl mx-auto pb-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
