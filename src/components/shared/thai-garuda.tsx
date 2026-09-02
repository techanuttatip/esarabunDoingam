"use client";

import { useState, useEffect } from "react";

interface GarudaProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

/**
 * Official Royal Thai Government Garuda Emblem (ตราครุฑพระราชทาน)
 * Uses high-resolution authentic emblem from Doi Ngam SAO / Thai Government standard,
 * with real-time support for custom admin-uploaded Garuda emblems from Settings.
 */
export function ThaiGaruda({
  className = "w-20 h-20",
  width,
  height,
  style,
}: GarudaProps) {
  const [garudaSrc, setGarudaSrc] = useState<string>("/images/thai-garuda.png");

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
      className={`object-contain select-none print:contrast-125 inline-block ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined,
        ...style,
      }}
      loading="eager"
    />
  );
}
