"use client";

import React from "react";
import { DOIGAM_LOGO_BASE64 } from "@/assets/branding-images";

interface DoiNgamLogoEmblemProps {
  className?: string;
  size?: number;
}

export function DoiNgamLogoEmblem({
  className = "w-11 h-11",
  size = 44,
}: DoiNgamLogoEmblemProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={DOIGAM_LOGO_BASE64}
      alt="ตราสัญลักษณ์ องค์การบริหารส่วนตำบลดอยงาม"
      className={`object-contain select-none drop-shadow-sm inline-block ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
    />
  );
}
