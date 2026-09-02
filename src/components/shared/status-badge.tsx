import { Badge } from "@/components/ui/badge";

export type StatusType = 
  | "PENDING" | "APPROVED" | "REJECTED" | "DRAFT" 
  | "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
}

const statusMap: Record<string, { variant: any; label: string }> = {
  PENDING: { variant: "warning", label: "รอดำเนินการ" },
  APPROVED: { variant: "success", label: "อนุมัติแล้ว" },
  REJECTED: { variant: "destructive", label: "ปฏิเสธ" },
  DRAFT: { variant: "secondary", label: "แบบร่าง" },
  ACTIVE: { variant: "success", label: "ใช้งาน" },
  INACTIVE: { variant: "secondary", label: "ปิดใช้งาน" },
  COMPLETED: { variant: "success", label: "เสร็จสิ้น" },
  CANCELLED: { variant: "destructive", label: "ยกเลิก" },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusMap[status] || { variant: "default", label: status };
  
  return (
    <Badge variant={config.variant as any}>
      {label || config.label}
    </Badge>
  );
}
