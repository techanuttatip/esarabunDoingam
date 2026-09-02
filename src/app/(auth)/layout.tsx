import { DOIGAM_OFFICE_BG_BASE64 } from "@/assets/branding-images";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-hidden bg-slate-950">
      {/* Full-Screen Real Office Atmospheric Background (Embedded Base64 - 100% Reliable) */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[2px] brightness-[0.45] transition-transform duration-1000"
        style={{ backgroundImage: `url(${DOIGAM_OFFICE_BG_BASE64})` }}
      />

      {/* Cinematic Gradient Vignette & Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-[#0a1936]/70 to-[#041226]/85" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-cyan-500/20 blur-[130px] pointer-events-none" />

      {/* Main Glassmorphism Floating Card Container */}
      <div className="w-full max-w-5xl rounded-[2.5rem] bg-white/90 backdrop-blur-3xl border border-white/80 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row min-h-[620px] relative z-10">
        {children}
      </div>
    </div>
  );
}
