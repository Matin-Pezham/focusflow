import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Timer, BarChart3, Settings } from 'lucide-react';

const navItems: Array<{ name: string; to: string; Icon: React.ComponentType<any> }> = [
  { name: 'Dashboard', to: '/', Icon: LayoutDashboard },
  { name: 'Tasks', to: '/tasks', Icon: CheckSquare },
  { name: 'Focus', to: '/pomodoro', Icon: Timer },
  { name: 'Analytics', to: '/analytics', Icon: BarChart3 },
  { name: 'Settings', to: '/settings', Icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-white border-r border-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">FF</div>
        <div>
          <div className="text-sm font-semibold text-slate-900">FocusFlow</div>
          <div className="text-xs text-slate-500">Get things done</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {navItems.map(({ name, to, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Profile */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-medium">M</div>
          <div>
            <div className="text-sm font-medium text-slate-900">Matin</div>
            <div className="text-xs text-slate-500">Frontend Developer</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
