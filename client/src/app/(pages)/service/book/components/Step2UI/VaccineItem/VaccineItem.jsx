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
        id={item.vaccine_info.vaccine_id}
        value={item.vaccine_info.vaccine_id}
        className="mr-3"
      />

      <div className="flex flex-1 flex-col gap-1">
        <span className="font-medium text-sm">
          {item.vaccine_info.vaccine_name}
        </span>

        <span className="text-[10px] text-muted-foreground">
          Manufacture date: {formatDate(item.vaccine_info.manufacture_date)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Entry date: {formatDate(item.vaccine_info.entry_date)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          Expiry date: {formatDate(item.vaccine_info.expiry_date)}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-sm">
          SL: <b>{item.vaccine_info.quantity}</b>
        </span>

        <span className="text-sm font-semibold text-primary">
          {Number(item.vaccine_info.price).toLocaleString("vi-VN")} ₫
        </span>
      </div>
    </Label>
  )
}