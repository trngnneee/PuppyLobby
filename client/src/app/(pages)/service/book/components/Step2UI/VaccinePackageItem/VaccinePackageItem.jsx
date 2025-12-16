import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const VaccinePackageItem = ({ item }) => {
  return (
    <Label
      htmlFor={item.package_id}
      className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
    >
      <RadioGroupItem
        id={item.package_id}
        value={item.package_id}
        className="mr-3"
      />

      <div className="flex flex-1 flex-col gap-1">
        <span className="font-medium text-[12px]">
          {item.package_name}
        </span>

        <span className="text-[10px] text-muted-foreground">
          Duration: {item.duration} month
        </span>

        <span className="text-[10px] text-muted-foreground line-clamp-1">
          Description: {item.description}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold text-primary">
          {Number(item.total_original_price).toLocaleString("vi-VN")} ₫
        </span>
      </div>
    </Label>
  );
};
