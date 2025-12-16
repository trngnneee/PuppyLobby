import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/utils/date"

export const VaccineItem = ({ item }) => {
  return (
    <Label
      htmlFor={item.vaccine_id}
      className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
    >
      <RadioGroupItem
        id={item.vaccine_id}
        value={item.vaccine_id}
        className="mr-3"
      />

      <div className="flex flex-1 flex-col gap-1">
        <span className="font-medium text-sm">
          {item.vaccine_name}
        </span>

        <span className="text-[10px] text-muted-foreground">
          NSX: {formatDate(item.manufacture_date)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Nhập: {formatDate(item.entry_date)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          HSD: {formatDate(item.expiry_date)}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-sm">
          SL: <b>{item.quantity}</b>
        </span>

        <span className="text-sm font-semibold text-primary">
          {Number(item.price).toLocaleString("vi-VN")} ₫
        </span>
      </div>
    </Label>
  )
}