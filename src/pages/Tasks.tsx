import React, { useEffect, useState } from "react";

interface Goal {
  id: number;
  title: string;
  completed: boolean;
}

const Tasks: React.FC = () => {
  const [input, setInput] = useState("");

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("focusflow-goals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("focusflow-goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!input.trim()) return;

    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: input,
        completed: false,
      },
    ]);

    setInput("");
  };

  const toggleGoal = (id: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 md:p-10">

        <h1 className="text-3xl font-bold mb-2">
          Daily Goals
        </h1>

        <p className="text-slate-500 mb-8">
          Track your most important tasks.
        </p>

        <div className="flex gap-3 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            onClick={addGoal}
            className="bg-blue-600 text-white px-5 rounded-xl"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                />

                <span
                  className={
                    goal.completed
                      ? "line-through text-slate-400"
                      : ""
                  }
                >
                  {goal.title}
                </span>
              </div>

              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Tasks;