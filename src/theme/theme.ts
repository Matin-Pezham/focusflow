export const themes = {
  light: {
    background: "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(129,140,248,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.09),_transparent_34%),linear-gradient(135deg,_#f6f8fb_0%,_#f8fafc_48%,_#fdfdfd_100%)]",
    surface: "bg-white/70 backdrop-blur-2xl border border-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.07)]",
    card: "bg-white/75 backdrop-blur-2xl border border-slate-200/70 shadow-[0_20px_70px_rgba(15,23,42,0.08)]",
    text: "text-slate-900",
    secondary: "text-slate-500",
  },

  cyberpunk: {
    background: `
      bg-[#040816]
      bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.20),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent_30%)]
    `,
    surface: `
      bg-[#10192f]/75
      backdrop-blur-2xl
    `,
    card: `
      bg-[#10192f]/75
      backdrop-blur-2xl
      border
      border-cyan-400/20
      shadow-[0_20px_70px_rgba(34,211,238,0.14)]
    `,
    text: "text-slate-50",
    secondary: "text-cyan-100/75",
  },
};