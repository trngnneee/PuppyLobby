"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useParams } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/utils/date";
import { Button } from "@/components/ui/button";

export default function AssignEmployeePage() {
  const { id } = useParams();
  const [branchID, setBranchID] = useState("1");
  const now = today(getLocalTimeZone());
  const [date, setDate] = useState({
    end: now.add({ days: 3 }),
    start: now,
  });

  return (
    <>
      <SectionHeader title={`Assign work for Employee ${id}`} />
      <form className="mt-[30px]" id="assignEmployeeForm">
        <div className="">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="branch" className="text-sm font-medium text-[var(--main)]">Branch</Label>
                <Select defaultValue={branchID} onValueChange={setBranchID}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Employee Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Branch 1</SelectItem>
                    <SelectItem value="2">Branch 2</SelectItem>
                    <SelectItem value="3">Branch 3</SelectItem>
                    <SelectItem value="4">Branch 4</SelectItem>
                    <SelectItem value="5">Branch 5</SelectItem>
                    <SelectItem value="6">Branch 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="date_of_birth" className="text-sm font-medium text-[var(--main)]">Date of birth</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Input
                    type="text"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={`${formatDate(date.start)} - ${formatDate(date.end)}`}
                    readOnly
                    className="cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <RangeCalendar
                    className="rounded-md border p-2"
                    onChange={setDate}
                    value={date}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="mt-[30px]">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="position" className="text-sm font-medium text-[var(--main)]">Position</Label>
                <Input
                  type="text"
                  id="position"
                  name="position"
                />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="salary" className="text-sm font-medium text-[var(--main)]">Salary</Label>
              <Input
                  type="number"
                  min={0}
                  id="salary"
                  name="salary"
                />
            </div>
          </div>
        </div>
        <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Assign</Button>
      </form>
    </>
  )
}