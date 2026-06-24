import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-500">Customize your FocusFlow experience.</p>
        </header>

        <main className="flex items-center justify-center py-12">
          <div className="w-full sm:w-3/4 lg:w-1/2">
            <div className="bg-white/90 border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
              <h2 className="text-lg font-semibold text-slate-900">Settings Module Coming Soon</h2>
              <p className="mt-3 text-sm text-slate-500">(Placeholder)</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
