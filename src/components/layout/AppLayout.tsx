import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const SIDEBAR_WIDTH = '260px';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      {/* Fixed sidebar on the left for lg+ screens */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen" style={{ width: SIDEBAR_WIDTH }}>
        <Sidebar />
      </div>

      {/* Main content — account for sidebar width on large screens */}
      <div className="lg:ml-[260px]">
        {/* Topbar */}
        <div className="">
          <Topbar />
        </div>

        <main className="flex-1 p-8 min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mt-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
