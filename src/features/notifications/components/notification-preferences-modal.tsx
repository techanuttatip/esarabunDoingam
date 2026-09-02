"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
}: NotificationPreferencesModalProps) {
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(true);
  const [lineOa, setLineOa] = useState(true);
  const [sms, setSms] = useState(false);

  const [events, setEvents] = useState({
    newDocument: { inApp: true, email: true, line: true, sms: false },
    assigned: { inApp: true, email: true, line: true, sms: false },
    dueSoon: { inApp: true, email: true, line: true, sms: false },
    overdue: { inApp: true, email: true, line: true, sms: true },
    approval: { inApp: true, email: true, line: true, sms: false },
    reserved: { inApp: true, email: false, line: true, sms: false },
    cancelled: { inApp: true, email: true, line: true, sms: false },
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-base">
                ศูนย์ตั้งค่าการแจ้งเตือนหลายช่องทาง (Multi-Channel Notification Center)
              </h3>
              <p className="text-xs text-slate-300">
                In-App, Email ราชการ, LINE Official Account และ SMS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-2 font-bold animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อยแล้ว
            </div>
          )}

          {/* Master Channel Toggles */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              ช่องทางการรับการแจ้งเตือนหลัก (Master Channels)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* In-App */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Bell className="w-4 h-4 text-blue-600" />
                    In-App
                  </div>
                  <input
                    type="checkbox"
                    checked={inApp}
                    onChange={(e) => setInApp(e.target.checked)}
                    className="w-4 h-4 accent-navy-900 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">แจ้งเตือนบนแถบเมนูด้านบนของระบบ</p>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email
                  </div>
                  <input
                    type="checkbox"
                    checked={email}
                    onChange={(e) => setEmail(e.target.checked)}
                    className="w-4 h-4 accent-navy-900 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">ส่งเข้าอีเมลราชการ @doigam.go.th</p>
              </div>

              {/* LINE OA */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    LINE OA
                  </div>
                  <input
                    type="checkbox"
                    checked={lineOa}
                    onChange={(e) => setLineOa(e.target.checked)}
                    className="w-4 h-4 accent-navy-900 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">ส่งแจ้งเตือนผ่าน LINE Official อบต.</p>
              </div>

              {/* SMS */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    SMS
                  </div>
                  <input
                    type="checkbox"
                    checked={sms}
                    onChange={(e) => setSms(e.target.checked)}
                    className="w-4 h-4 accent-navy-900 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">ข้อความด่วนพิเศษสำหรับงานวิกฤต</p>
              </div>
            </div>
          </div>

          {/* Event-specific Matrix */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-3">
              ตั้งค่าช่องทางแยกตามประเภทเหตุการณ์ (Event Matrix)
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3">เหตุการณ์ (Event)</th>
                    <th className="p-3 text-center w-20">In-App</th>
                    <th className="p-3 text-center w-20">Email</th>
                    <th className="p-3 text-center w-20">LINE OA</th>
                    <th className="p-3 text-center w-20">SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { key: "newDocument", label: "มีหนังสือเข้าใหม่ (New Document)" },
                    { key: "assigned", label: "ได้รับมอบหมายงานใหม่ (Assigned)" },
                    { key: "dueSoon", label: "หนังสือใกล้ถึงกำหนดส่ง SLA (Due Soon)" },
                    { key: "overdue", label: "งานเกินกำหนดเวลา (Overdue Alert)" },
                    { key: "approval", label: "หนังสือรอการเกษียน/อนุมัติ (Approval)" },
                    { key: "reserved", label: "มีการจองเลขสารบรรณ (Number Reserved)" },
                    { key: "cancelled", label: "มีการขีดฆ่ายกเลิกเลข (Number Cancelled)" },
                  ].map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-900">{row.label}</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(events as any)[row.key].inApp}
                          onChange={(e) =>
                            setEvents({
                              ...events,
                              [row.key]: { ...(events as any)[row.key], inApp: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-navy-900 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(events as any)[row.key].email}
                          onChange={(e) =>
                            setEvents({
                              ...events,
                              [row.key]: { ...(events as any)[row.key], email: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(events as any)[row.key].line}
                          onChange={(e) =>
                            setEvents({
                              ...events,
                              [row.key]: { ...(events as any)[row.key], line: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(events as any)[row.key].sms}
                          onChange={(e) =>
                            setEvents({
                              ...events,
                              [row.key]: { ...(events as any)[row.key], sms: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-amber-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold rounded-xl h-9 px-4 border-slate-300"
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-9 px-6 shadow-xs cursor-pointer"
          >
            บันทึกการตั้งค่า
          </Button>
        </div>
      </div>
    </div>
  );
}
