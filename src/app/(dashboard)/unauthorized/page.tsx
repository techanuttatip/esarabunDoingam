"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Card className="w-full max-w-md text-center border-red-100 shadow-sm">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-slate-500 mb-8">
            ขออภัย คุณไม่มีสิทธิ์เพียงพอในการเข้าถึงหน้านี้ 
            กรุณาติดต่อผู้ดูแลระบบหากคุณต้องการสิทธิ์เพิ่มเติม
          </p>
          <Button asChild className="w-full bg-navy-700 hover:bg-navy-800 text-white">
            <Link href="/">กลับสู่หน้าแดชบอร์ด</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
