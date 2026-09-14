"use client";

import { useState, useEffect } from "react";

interface GarudaProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  /**
   * Official Thai Government Garuda standard sizes:
   * - 'standard': 3.0 cm (30mm) for External letters, Orders, Announcements, Stamped letters
   * - 'small': 1.5 cm (15mm) for Internal memos (บันทึกข้อความ)
   * - 'custom': custom size based on width/height/className
   */
  size?: "standard" | "small" | "custom";
}

/**
 * Official Royal Thai Government Garuda Emblem (ตราครุฑพระราชทาน)
 * Complies with the Prime Minister's Office Regulation on Correspondence Work B.E. 2526:
 * - Standard Garuda: 3.0 cm height (ครุฑมาตรฐาน ขนาด ๓ ซม.)
 * - Small Garuda: 1.5 cm height (ครุฑขนาดเล็ก ขนาด ๑.๕ ซม.)
 * Uses high-resolution authentic emblem with real-time support for custom admin uploads.
 */
export function ThaiGaruda({
  className = "",
  width,
  height,
  style,
  size = "standard",
}: GarudaProps) {
  const [garudaSrc, setGarudaSrc] = useState<string>("/images/thai-garuda.png");

  const sizeClass =
    size === "standard"
      ? "h-[3cm] max-h-[3cm] w-auto print:h-[3cm] print:w-auto print:max-h-[3cm]"
      : size === "small"
      ? "h-[1.5cm] max-h-[1.5cm] w-auto print:h-[1.5cm] print:w-auto print:max-h-[1.5cm]"
      : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const custom = localStorage.getItem("smartsarabun_custom_garuda");
        if (custom) {
          setGarudaSrc(custom);
        }
      } catch (err) {
        console.error("Failed to read custom garuda from storage", err);
      }
    }
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={garudaSrc}
      alt="ตราครุฑราชการ"
      className={`object-contain select-none print:contrast-125 inline-block ${sizeClass} ${className}`.trim()}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
      loading="eager"
      decoding="sync"
    />
  );
}
