import React from 'react';
import { Search, Bell, Moon } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-7xl p-4">
        <div className="bg-white rounded-xl border border-slate-100 h-[72px] flex items-center px-4">
          {/* Left: Search */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="relative w-full md:w-80 lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="search"
                placeholder="Search tasks, goals..."
                aria-label="Search"
                className="w-full pl-10 pr-4 py-2 rounded-md bg-slate-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder-slate-400 transition-all text-sm"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-4 ml-4">
            <button
              aria-label="Notifications"
              className="p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              aria-label="Toggle dark mode"
              className="p-2 rounded-md hover:bg-slate-50 transition-colors text-slate-600"
            >
              <Moon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col text-right">
                <span className="text-sm text-slate-500">Good Morning,</span>
                <span className="text-sm font-semibold text-slate-900">Matin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-medium shadow-sm">
                M
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
