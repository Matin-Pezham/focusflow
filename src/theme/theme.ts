export const themes = {
  light: {
    background: "bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_30%),linear-gradient(120deg,_#f8fafc_0%,_#eef2ff_100%)]",
    surface: "bg-white/80 backdrop-blur-xl",
    card: "bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_45px_rgba(15,23,42,0.06)]",
    text: "text-slate-900",
    secondary: "text-slate-500",
  },

  cyberpunk: {
    background: `
      bg-[#050816]
      bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.20),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.22),transparent_28%)]
    `,
    surface: `
      bg-[#0d1328]/75
      backdrop-blur-2xl
    `,
    card: `
      bg-[#11182d]/80
      backdrop-blur-2xl
      border
      border-cyan-400/20
      shadow-[0_10px_50px_rgba(34,211,238,0.12)]
    `,
    text: "text-slate-50",
    secondary: "text-cyan-100/75",
  },
};