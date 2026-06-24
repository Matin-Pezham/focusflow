import React from 'react';

const StatCard: React.FC<{ title: string; value: React.ReactNode }> = ({ title, value }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{value}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const goals = JSON.parse(
  localStorage.getItem("focusflow-goals") || "[]"
);

const totalGoals = goals.length;

const completedGoals = goals.filter(
  (goal: any) => goal.completed
).length;

const pendingGoals = totalGoals - completedGoals;

const completionRate =
  totalGoals === 0
    ? 0
    : Math.round((completedGoals / totalGoals) * 100);

const remainingPomodoro = localStorage.getItem(
  "pomodoro-seconds"
);
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-500">Here's your productivity overview.</p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<StatCard
  title="Completed Goals"
  value={completedGoals}
/>

<StatCard
  title="Pending Goals"
  value={pendingGoals}
/>

<StatCard
  title="Completion Rate"
  value={`${completionRate}%`}
/>

<StatCard
  title="Pomodoro Time Left"
  value={
    remainingPomodoro
      ? `${Math.floor(Number(remainingPomodoro) / 60)}m`
      : "25m"
  }
/>
          </div>
        </section>

        {/* Placeholder for more dashboard content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent Tasks</h3>
            <p className="mt-2 text-sm text-slate-500">(Placeholder)</p>
          </div>
          <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Focus Sessions</h3>
            <p className="mt-2 text-sm text-slate-500">(Placeholder)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
