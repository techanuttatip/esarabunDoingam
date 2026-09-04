import { DOIGAM_OFFICE_BG_BASE64 } from "@/assets/branding-images";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#060e1e]">
      {/* Background Image with Cinematic Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[12px] opacity-20 scale-110"
        style={{ backgroundImage: `url(${DOIGAM_OFFICE_BG_BASE64})` }}
      />

      {/* Layered Gradient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060e1e]/95 via-[#0a1a3a]/85 to-[#0c0f1e]/95" />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[200px] h-[200px] rounded-full bg-cyan-400/8 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1z'/%3E%3Cpath d='M0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Main Container */}
      <div className="w-full max-w-[420px] relative z-10 py-4">
        {children}
      </div>

      {/* Bottom Attribution */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-[10px] text-white/20 font-medium">
          © ๒๕๖๙ องค์การบริหารส่วนตำบลดอยงาม — ระบบสารบรรณอิเล็กทรอนิกส์
        </p>
      </div>
    </div>
  );
}
