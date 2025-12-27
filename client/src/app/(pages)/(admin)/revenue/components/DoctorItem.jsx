"use client"

import { Label } from "@/components/ui/label"
import { formatDate } from "@/utils/date"
import { User, Calendar, GraduationCap, Stethoscope } from "lucide-react"

export const DoctorItem = ({ item, doctor, setDoctor }) => {
  const isSelected = doctor?.employee_id === item.employee_id

  const handleClick = () => {
    if (isSelected) {
      setDoctor(null)
    } else {
      setDoctor(item)
    }
  }

  return (
    <Label
      onClick={handleClick}
      className={`flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${
            isSelected ? "bg-primary/20" : "bg-muted"
          }`}>
            <User className={`h-5 w-5 ${
              isSelected ? "text-primary" : "text-muted-foreground"
            }`} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base">
              {item.employee_name}
            </span>
            <span className="text-xs text-muted-foreground">
              ID: {item.employee_id}
            </span>
          </div>
        </div>
        
        <div className={`rounded-full px-3 py-1 text-xs font-medium ${
          item.gender === "Male" 
            ? "bg-blue-100 text-blue-700" 
            : "bg-pink-100 text-pink-700"
        }`}>
          {item.gender}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pl-1">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Born: {formatDate(item.date_of_birth)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{item.degree}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {item.specialization}
          </span>
        </div>
      </div>

      {item.is_current_employee ? (
        <div className="mt-1 flex items-center justify-center rounded-md bg-green-100 py-1.5 text-xs font-semibold text-green-700">
          Currently Working
        </div>
      )
      : (
        <div className="mt-1 flex items-center justify-center rounded-md bg-red-100 py-1.5 text-xs font-semibold text-red-700">
          No Longer Working
        </div>
      )}
    </Label>
  )
}