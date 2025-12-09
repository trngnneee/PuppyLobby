"use client"

import { SectionSubHeader } from "@/app/(pages)/(admin)/product/manage/components/SectionSubHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ScheduleBox = ({ index, onChange, onDelete, vaccineList, detail = {} }) => {
  const [vaccineType, setVaccineType] = useState(detail.vaccine_id || "");
  const [week, setWeek] = useState("");
  const [dosage, setDosage] = useState("");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (!detail || Object.keys(detail).length === 0) return;

    setVaccineType(detail.vaccine_id);
    setWeek(detail.scheduled_week);
    setDosage(detail.dosage);
    setSubmit(Object.keys(detail).length === 0 ? false : true);
  }, [detail]);

  const handleSave = () => {
    setSubmit(true);
    onChange({
      vaccine_id: vaccineType,
      scheduled_week: week,
      dosage: dosage
    }, index);
  }

  const handleDelete = () => {
    setSubmit(false);
    setVaccineType("");
    setWeek("");
    setDosage("");
    onDelete(index);
  }

  return (
    <div className="mt-5 border rounded-[20px] p-5 bg-white relative">
      <Button className="absolute right-5 top-5 p-0 w-5 h-5 rounded-2xl" type="button" onClick={handleDelete}>X</Button>
      <SectionSubHeader title={`Schedule ${index + 1}`} />
      <div className="">
        <div className="flex gap-10">
          <div className="w-full">
            <div className="mb-[15px] *:not-first:mt-2">
              <Label htmlFor={`vaccine_type-${index}`} className="text-sm font-medium text-[var(--main)]">Vaccine Type</Label>
              <Select value={vaccineType} onValueChange={setVaccineType}>
                <SelectTrigger id={`vaccine_type-${index}`}>
                  <SelectValue placeholder="Vaccine Type" />
                </SelectTrigger>
                <SelectContent
                  className={"max-h-[300px] overflow-y-scroll"}
                >
                  {vaccineList.length > 0 && vaccineList.map((item, index) => (
                    <SelectItem key={index} value={item.vaccine_id}>{item.vaccine_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex gap-10">
          <div className="w-full">
            <div className="mb-[15px] *:not-first:mt-2">
              <Label htmlFor="schedule_week" className="text-sm font-medium text-[var(--main)]">Schedule week</Label>
              <Input
                type="number"
                min="0"
                id="schedule_week"
                name="schedule_week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mb-[15px] *:not-first:mt-2">
              <Label htmlFor="dosage" className="text-sm font-medium text-[var(--main)]">Dosage</Label>
              <Input
                type="number"
                min="0"
                id="dosage"
                name="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={submit} type="button" onClick={handleSave} className={cn(
          "bg-[var(--main)] hover:bg-[var(--main-hover)] text-white",
          submit && "opacity-50 cursor-not-allowed"
        )}>{submit ? "Saved" : "Save this Schedule"}</Button>
      </div>
    </div>
  )
}