"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Inbox,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Building,
  Users,
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState<"today" | "week" | "month" | "year">("month");

  const stats = [
    {
      title: "หนังสือรับ-ส่งทั้งหมด",
      value: "2,784 ฉบับ",
      change: "+12.5%",
      isPositive: true,
      desc: "ปีงบประมาณ 2569",
      icon: FileText,
      color: "bg-blue-600",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
    },
    {
      title: "รอดำเนินการ / เกษียน",
      value: "18 ฉบับ",
      change: "4 ด่วนที่สุด",
      isPositive: false,
      desc: "ค้างในคิวงานของกอง",
      icon: Clock,
      color: "bg-amber-600",
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
    },
    {
      title: "รอลงนาม / อนุมัติ",
      value: "5 ฉบับ",
      change: "รอ ปลัด/นายก",
      isPositive: true,
      desc: "คำสั่งและประกาศ",
      icon: ShieldCheck,
      color: "bg-purple-600",
      textColor: "text-purple-700",
      bgLight: "bg-purple-50",
    },
    {
      title: "เสร็จสิ้นตามกำหนด (SLA)",
      value: "98.4%",
      change: "+1.2%",
      isPositive: true,
      desc: "มาตรฐานบริการประชาชน",
      icon: CheckCircle2,
      color: "bg-emerald-600",
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
    },
  ];

  const recentDocs = [
    {
      id: "doc-01",
      docNo: "ชร 0023.1/ว 4589",
      regNo: "2784/2569",
      title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี 2569",
      from: "ที่ว่าการอำเภอพาน",
      dept: "กองช่าง",
      speed: "ด่วนที่สุด",
      status: "รอเกษียน",
      date: "28 ส.ค. 2569",
    },
    {
      id: "doc-02",
      docNo: "มท 0808.2/ว 5232",
      regNo: "2783/2569",
      title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจและการจัดทำข้อบัญญัติงบประมาณรายจ่าย",
      from: "กรมส่งเสริมการปกครองท้องถิ่น",
      dept: "กองคลัง",
      speed: "ด่วนที่สุด",
      status: "รอพิจารณา",
      date: "28 ส.ค. 2569",
    },
    {
      id: "doc-03",
      docNo: "ศธ 04001/ว 1120",
      regNo: "2782/2569",
      title: "แนวทางการจัดการเรียนการสอนและสนับสนุนอาหารกลางวันศูนย์พัฒนาเด็กเล็ก",
      from: "สพป.เชียงราย เขต 2",
      dept: "กองการศึกษาฯ",
      speed: "ปกติ",
      status: "เสร็จสิ้น",
      date: "27 ส.ค. 2569",
    },
    {
      id: "doc-04",
      docNo: "สธ 0201/ว 884",
      regNo: "2781/2569",
      title: "มาตรการเฝ้าระวังและป้องกันควบคุมโรคติดต่อตามฤดูกาลในพื้นที่ตำบลดอยงาม",
      from: "สสอ.พาน",
      dept: "กองสาธารณสุข",
      speed: "ด่วน",
      status: "เสร็จสิ้น",
      date: "27 ส.ค. 2569",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="แดชบอร์ดภาพรวมระบบสารบรรณ (Executive Dashboard)"
          description="ศูนย์บัญชาการและรายงานสถิติงานสารบรรณอิเล็กทรอนิกส์ องค์การบริหารส่วนตำบลดอยงาม"
        />

        <div className="flex items-center gap-2">
          <Button asChild className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs">
            <Link href="/send">
              <Plus className="w-4 h-4 text-amber-300" />
              สร้างหนังสือใหม่
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <Card key={idx} className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{item.title}</span>
                <div className={`w-9 h-9 rounded-xl ${item.bgLight} ${item.textColor} flex items-center justify-center`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</h3>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.isPositive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.change}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-1 font-medium">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent Documents Table */}
        <div className="lg:col-span-8">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-blue-700" />
                  หนังสือราชการเข้า-ออกล่าสุด
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  หนังสือที่ลงรับและอยู่ระหว่างการดำเนินการใน อบต.ดอยงาม
                </CardDescription>
              </div>

              <Button asChild variant="outline" size="sm" className="text-xs font-bold rounded-xl border-slate-300">
                <Link href="/documents">
                  ดูทั้งหมด ➔
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-3.5">เลขรับ / เลขที่หนังสือ</th>
                      <th className="p-3.5">เรื่อง / หน่วยงาน</th>
                      <th className="p-3.5">กองรับผิดชอบ</th>
                      <th className="p-3.5">สถานะ</th>
                      <th className="p-3.5 text-right">วันที่</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors bg-white">
                        <td className="p-3.5">
                          <span className="font-extrabold text-slate-900 block">{doc.regNo}</span>
                          <span className="font-mono text-[11px] text-slate-500">{doc.docNo}</span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900 line-clamp-1">{doc.title}</p>
                          <p className="text-[11px] text-slate-500">จาก: {doc.from}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {doc.dept}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {doc.speed === "ด่วนที่สุด" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200 mr-1">
                              ด่วนที่สุด
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right text-slate-500 whitespace-nowrap">
                          {doc.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Quick Actions & Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-100/90 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-extrabold text-slate-900">
                ทางลัดงานสารบรรณ (Quick Actions)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <Button asChild variant="outline" className="w-full justify-start h-11 text-xs font-bold rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 gap-2.5">
                <Link href="/receive">
                  <Inbox className="w-4 h-4 text-blue-700" />
                  <span>ลงรับหนังสือเข้าภายนอก & ปั๊มตรายาง</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-11 text-xs font-bold rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 gap-2.5">
                <Link href="/send">
                  <Send className="w-4 h-4 text-emerald-700" />
                  <span>ร่างหนังสือราชการ & ออกเลขส่งกอง</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-11 text-xs font-bold rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 gap-2.5">
                <Link href="/approvals">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>คิวงานรออนุมัติ / ลงนามคำสั่ง</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-11 text-xs font-bold rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 gap-2.5">
                <Link href="/cabinet">
                  <Building className="w-4 h-4 text-amber-700" />
                  <span>ค้นคืนเอกสารในแฟ้มตู้ดิจิทัล</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* SLA Performance Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-200">SLA ประสิทธิภาพงานสารบรรณ</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                ดีเยี่ยม
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              อัตราการส่งมอบและเกษียนหนังสือตรงตามกรอบเวลาราชการเฉลี่ย <strong>๑.๒ วันทำการ</strong> (เกณฑ์มาตรฐาน อบต. &lt; ๓ วัน)
            </p>
            <div className="w-full bg-navy-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[98.4%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
