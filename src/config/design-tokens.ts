/**
 * SMART SARABAN DESIGN TOKENS
 * Centralized Design System Tokens for Digital Government Workspace
 * (Functional Glassmorphism, Soft Minimalism, Enterprise UX)
 */

export const designTokens = {
  // 1. Functional Glassmorphism Tokens
  glass: {
    background: "rgba(255, 255, 255, 0.80)",
    backgroundHover: "rgba(255, 255, 255, 0.95)",
    backgroundSubtle: "rgba(255, 255, 255, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.85)",
    borderSubtle: "1px solid rgba(226, 232, 240, 0.80)",
    borderHighlight: "1px solid rgba(0, 82, 255, 0.35)",
    shadow: "0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)",
    shadowHover: "0 20px 40px -10px rgba(0, 82, 255, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)",
    shadowDock: "0 16px 40px rgba(15, 23, 42, 0.06)",
    blur: "20px",
    blurHeavy: "28px",
    blurLight: "12px",
    opacity: 0.80,
    surface: "glass-card",
    surfaceStrong: "glass-panel",
  },

  // 2. Semantic Color System (One primary accent + semantic indicators)
  colors: {
    primary: {
      DEFAULT: "#0052FF", // Vibrant Royal Blue
      hover: "#0046db",
      light: "#eff4ff",
      gradient: "linear-gradient(135deg, #0052FF 0%, #0284c7 100%)",
      gradientHover: "linear-gradient(135deg, #0046db 0%, #0369a1 100%)",
    },
    secondary: {
      DEFAULT: "#0284c7", // Subtle Cyan Accent
      light: "#f0f9ff",
    },
    background: {
      base: "#f0f4f9", // Crystal Light Base
      pure: "#ffffff",
      surface: "#f8fafc",
      muted: "#e2e8f0",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#475569", // Slate 600
      muted: "#94a3b8", // Slate 400
      inverse: "#ffffff",
    },
    // Standardized Thai Government Lifecycle Status Colors
    status: {
      draft: {
        label: "แบบร่าง",
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-300",
        dot: "bg-slate-500",
      },
      reserved: {
        label: "จองเลขแล้ว",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-600",
      },
      registered: {
        label: "ลงรับแล้ว",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        dot: "bg-cyan-600",
      },
      pending: {
        label: "รอดำเนินการ",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-600",
      },
      processing: {
        label: "กำลังเสนอเกษียน",
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
        dot: "bg-indigo-600",
      },
      completed: {
        label: "เสร็จสิ้น/ลงนามแล้ว",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-600",
      },
      rejected: {
        label: "ส่งกลับแก้ไข",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-600",
      },
      overdue: {
        label: "เกินกำหนด SLA",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-300",
        dot: "bg-red-600",
      },
      cancelled: {
        label: "ยกเลิก/แทงจำหน่าย",
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-300",
        dot: "bg-gray-400",
      },
    },
  },

  // 3. Typography Hierarchy
  typography: {
    display: "font-display text-2xl sm:text-3xl font-black tracking-tight",
    pageTitle: "text-xl sm:text-2xl font-black tracking-tight text-slate-900",
    sectionTitle: "text-base sm:text-lg font-extrabold text-slate-900",
    body: "text-sm leading-relaxed text-slate-700 font-normal",
    label: "text-xs font-bold text-slate-600 uppercase tracking-wider",
    caption: "text-xs text-slate-500 font-medium",
    metadata: "font-mono text-xs font-bold text-slate-600",
  },

  // 4. Geometry & Radii
  radius: {
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // 5. Z-Index Layers
  zIndex: {
    base: 0,
    content: 1,
    header: 20,
    sidebar: 30,
    dock: 40,
    popover: 50,
    modal: 60,
    workspaceStudio: 999999,
  },
} as const;
