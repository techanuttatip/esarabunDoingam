import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface DataTableToolbarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function DataTableToolbar({ onSearch, placeholder = "ค้นหา..." }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  )
}
