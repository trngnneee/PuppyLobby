"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/utils/date"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export const MedicineItem = ({ item, prescription, setPrescription }) => {
  const [open, setOpen] = useState(false)
  const [dosage, setDosage] = useState("")
  const productId = item.product_info.product_id
  const productName = item.product_info.product_name
  const checked = prescription.some(p => p.product_id === productId)

  const handleConfirm = () => {
    setPrescription(prev => [
      ...prev,
      {
        product_id: productId,
        product_name: productName,
        dosage,
      },
    ])
    setDosage("")
    setOpen(false)
  }

  return (
    <>
      <Label
        onClick={(e) => {
          e.stopPropagation()
          if (!checked) { 
            setOpen(true)
          }
        }}
        className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition"
      >
        <Checkbox checked={checked} className="mr-3 pointer-events-none" />

        <div className="flex flex-1 flex-col gap-1">
          <span className="font-medium text-sm">
            {item.product_info.product_name}
          </span>

          <span className="text-[10px] text-muted-foreground">
            Manufacture date: {formatDate(item.product_info.manufacture_date)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Entry date: {formatDate(item.product_info.entry_date)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Expiry date: {formatDate(item.product_info.expiry_date)}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-sm">
            SL: <b>{item.product_info.stock}</b>
          </span>

          <span className="text-sm font-semibold text-primary">
            {Number(item.product_info.price).toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </Label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="mb-4 text-lg font-semibold">
            Set Dosage for {item.product_info.product_name}
          </DialogTitle>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage (mg)</Label>
            <Input
              id="dosage"
              type="number"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!dosage}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}