import React, { useEffect, useState } from "react";

const INITIAL_TIME = 25 * 60;

const Pomodoro: React.FC = () => {
const [seconds, setSeconds] = useState(() => {
  const saved = localStorage.getItem("pomodoro-seconds");
  return saved ? Number(saved) : INITIAL_TIME;
});

const [isRunning, setIsRunning] = useState(() => {
  const saved = localStorage.getItem("pomodoro-running");
  return saved === "true";
});

  useEffect(() => {
    let timer: number;

    if (isRunning && seconds > 0) {
      timer = window.setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };
  useEffect(() => {
  localStorage.setItem("pomodoro-seconds", String(seconds));
}, [seconds]);

useEffect(() => {
  localStorage.setItem("pomodoro-running", String(isRunning));
}, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(INITIAL_TIME);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-2">Focus Session</h1>
        <p className="text-slate-500 mb-10">
          Stay focused and finish one task at a time.
        </p>

        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
          <div className="text-7xl font-bold mb-8">
            {formatTime(seconds)}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsRunning(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white"
            >
              Start
            </button>

            <button
              onClick={() => setIsRunning(false)}
              className="px-6 py-3 rounded-xl border"
            >
              Pause
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;