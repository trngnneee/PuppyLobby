import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/utils/date"
import Link from "next/link"

export const MedicalExamItem = ({ item }) => {
  return (
    <Link href={`/work/manage/medical-exam/${item.booking_id}`}>
      <Label
        htmlFor={item.booking_id}
        className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
      >
        <div className="flex flex-col gap-1">
          <div className="font-medium">
            {formatDate(item.date)}
          </div>

          <div className="text-sm text-muted-foreground">
            {item.pet_name} • {item.branch_name}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge
            variant={
              item.status === "completed"
                ? ""
                : item.status === "on_progress"
                  ? "secondary"
                  : "destructive"
            }
          >
            {item.status}
          </Badge>
        </div>
      </Label>
    </Link>
  )
}