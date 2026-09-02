"use client";

import React from "react";
import { useSession } from "@/components/providers/session-provider";

interface AntiLeakWatermarkProps {
  userName?: string;
  userPosition?: string;
  userDept?: string;
  ipAddress?: string;
  opacity?: number;
  className?: string;
}

export function AntiLeakWatermark({
  userName,
  userPosition,
  userDept,
  ipAddress = "192.168.1.104",
  opacity = 0.12,
  className = "",
}: AntiLeakWatermarkProps) {
  const { data: session } = useSession();

  const name = userName || session?.user?.name || "นางสาวสมร กองเงิน";
  const pos = userPosition || session?.user?.position || "นักวิชาการเงินและบัญชี";
  const dept = userDept || session?.user?.department || "กองคลัง อบต.ดอยงาม";

  const now = new Date();
  const timeString = `${now.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} ${now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`;

  const watermarkText = `${name} | ${pos} (${dept}) | ${timeString} | IP: ${ipAddress}`;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-30 overflow-hidden select-none print:opacity-100 ${className}`}
      aria-hidden="true"
    >
      <div
        className="w-full h-full flex flex-wrap items-center justify-around gap-16 p-8"
        style={{
          transform: "rotate(-25deg) scale(1.15)",
          transformOrigin: "center center",
        }}
      >
        {Array.from({ length: 24 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center font-mono text-[11px] font-bold text-slate-800 tracking-wider transition-opacity duration-300"
            style={{
              opacity,
              textShadow: "0 0 1px rgba(0,0,0,0.1)",
            }}
          >
            <span className="uppercase font-black text-[10px] text-blue-900 tracking-widest">
              [ OFFICIAL GOV WATERMARK - CONFIDENTIAL ]
            </span>
            <span className="mt-0.5 whitespace-nowrap">{watermarkText}</span>
            <span className="text-[9px] text-slate-500 font-normal">
              เอกสารมีชั้นความลับ ห้ามคัดลอกหรือเผยแพร่โดยไม่ได้รับอนุญาต
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
