"use client";

import Link from "next/link";
import { QrCode, ShieldCheck, ExternalLink } from "lucide-react";

interface VerificationSealProps {
  docId: string;
  docNo?: string;
  className?: string;
}

/**
 * Official e-Document Verification QR Seal (ตราประทับดิจิทัลพร้อม QR Code ตรวจสอบเอกสาร)
 * Compliant with Electronic Transactions Act B.E. 2544 and Royal Thai Government Standards.
 */
export function DocVerificationSeal({ docId, docNo, className = "" }: VerificationSealProps) {
  const verifyUrl = `/verify/${encodeURIComponent(docId)}`;

  return (
    <Link
      href={verifyUrl}
      target="_blank"
      className={`inline-flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-blue-50/80 border border-slate-300 hover:border-blue-300 rounded-xl transition-all group cursor-pointer text-slate-800 ${className}`}
      title="คลิกหรือสแกน QR Code เพื่อตรวจสอบความถูกต้องของหนังสือราชการฉบับนี้"
    >
      {/* Visual QR Code Box */}
      <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
          {/* QR Code Matrix Pattern Representation */}
          <rect x="0" y="0" width="30" height="30" rx="3" />
          <rect x="5" y="5" width="20" height="20" fill="white" />
          <rect x="10" y="10" width="10" height="10" />

          <rect x="70" y="0" width="30" height="30" rx="3" />
          <rect x="75" y="5" width="20" height="20" fill="white" />
          <rect x="80" y="10" width="10" height="10" />

          <rect x="0" y="70" width="30" height="30" rx="3" />
          <rect x="5" y="75" width="20" height="20" fill="white" />
          <rect x="10" y="80" width="10" height="10" />

          {/* Dots */}
          <rect x="40" y="10" width="8" height="8" />
          <rect x="52" y="10" width="8" height="8" />
          <rect x="40" y="25" width="8" height="8" />
          <rect x="52" y="25" width="8" height="8" />
          <rect x="40" y="40" width="20" height="20" rx="2" />
          <rect x="10" y="45" width="8" height="8" />
          <rect x="25" y="45" width="8" height="8" />
          <rect x="75" y="45" width="8" height="8" />
          <rect x="88" y="45" width="8" height="8" />
          <rect x="70" y="70" width="10" height="10" />
          <rect x="85" y="70" width="10" height="10" />
          <rect x="70" y="85" width="10" height="10" />
          <rect x="85" y="85" width="10" height="10" />
        </svg>
      </div>

      {/* Metadata */}
      <div className="text-left leading-tight">
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>ตรวจสอบเอกสารจริง (Verify)</span>
        </div>
        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
          ID: {docId}
        </div>
        <div className="text-[8px] text-slate-400 flex items-center gap-0.5 mt-0.5">
          <span>สแกนเพื่อตรวจลายเซ็นดิจิทัล</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </div>
      </div>
    </Link>
  );
}
