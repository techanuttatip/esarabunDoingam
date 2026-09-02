import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0052FF] text-white shadow-2xs hover:bg-[#0046db]",
        signature:
          "border-transparent bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-accent",
        sectionLabel:
          "border-[#0052FF]/30 bg-[#0052FF]/8 text-[#0052FF] font-mono text-[11px] uppercase tracking-[0.12em] px-3.5 py-1",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        outline:
          "border-slate-200 text-slate-700 bg-white",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withPulse?: boolean;
}

function Badge({ className, variant, withPulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {withPulse && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
