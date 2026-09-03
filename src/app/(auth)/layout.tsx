import { DOIGAM_OFFICE_BG_BASE64 } from "@/assets/branding-images";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#070d18]">
      {/* Background Image with Deep Atmospheric Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[8px] opacity-25 scale-105"
        style={{ backgroundImage: `url(${DOIGAM_OFFICE_BG_BASE64})` }}
      />

      {/* Cinematic Deep Royal Mesh & Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070d18]/90 via-[#0a1936]/80 to-[#050b14]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0052FF]/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-md relative z-10 py-6">
        {children}
      </div>
    </div>
  );
}
