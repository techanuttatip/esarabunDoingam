import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { AppTopbar } from "@/components/shared/topbar/app-topbar";
import { ScreenLockModal } from "@/components/shared/security/screen-lock-modal";
import { SaaSLockScreen } from "@/components/shared/saas/saas-lock-screen";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f9] text-slate-900 relative">
      {/* Background Pastel Ambient Glowing Orbs for Light Glass Refraction */}
      <div className="glow-orb-light-blue top-[-10%] left-[-5%] w-[650px] h-[650px] opacity-70" />
      <div className="glow-orb-light-cyan top-[25%] right-[-10%] w-[750px] h-[750px] opacity-65" />
      <div className="glow-orb-light-purple bottom-[-15%] left-[20%] w-[700px] h-[700px] opacity-60" />

      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <ScreenLockModal />
      <SaaSLockScreen />
    </div>
  );
}
