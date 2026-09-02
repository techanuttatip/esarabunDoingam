"use client";

import { useQuery } from "@tanstack/react-query";
import { userQueries } from "../queries/user-queries";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../types";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatThaiDate } from "@/lib/formatters/thai-date";
import { Button } from "@/components/ui/button";
import { Edit2, ShieldOff } from "lucide-react";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { useState } from "react";

export function UserTable() {
  const [search, setSearch] = useState("");
  const { data: users = [], isLoading } = useQuery(userQueries.all());

  const filteredUsers = users.filter(user => 
    user.firstName.includes(search) || 
    user.lastName.includes(search) || 
    user.username.includes(search)
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "ชื่อผู้ใช้",
    },
    {
      id: "fullName",
      header: "ชื่อ-นามสกุล",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: "position",
      header: "ตำแหน่ง",
    },
    {
      accessorKey: "departmentName",
      header: "หน่วยงาน",
    },
    {
      accessorKey: "roles",
      header: "บทบาท",
      cell: ({ row }) => row.original.roles.join(", "),
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "วันที่สร้าง",
      cell: ({ row }) => formatThaiDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
            <ShieldOff className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTableToolbar onSearch={setSearch} placeholder="ค้นหาชื่อผู้ใช้ หรือชื่อ-นามสกุล..." />
      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        isLoading={isLoading} 
      />
    </div>
  );
}
