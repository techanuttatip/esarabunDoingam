import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartSarabun Cloud Platform Super Admin | ศูนย์ควบคุมระบบคลาวด์และผู้เช่าส่วนกลาง",
  description: "ระบบบริหารจัดการโครงสร้างพื้นฐานคลาวด์ มัลติเทแนนท์ และความปลอดภัยระดับแพลตฟอร์ม",
};

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {children}
    </div>
  );
}
