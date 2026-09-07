import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { AppTopbar } from "@/components/shared/topbar/app-topbar";
import { ScreenLockModal } from "@/components/shared/security/screen-lock-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 relative font-sans antialiased">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <ScreenLockModal />
    </div>
  );
}

