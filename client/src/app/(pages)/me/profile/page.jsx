"use client"

import { Label } from "@/components/ui/label";
import { SectionHeader } from "../components/SectionHeader";
import AvatarUploader from "./components/AvatarUploader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date"
import { Calendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function MeProfilePage() {
  const [date, setDate] = useState(today(getLocalTimeZone()))
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <SectionHeader title="Profile" />
      <form className="">
        <div className="flex justify-center">
          <AvatarUploader />
        </div>
        <div className="mt-[30px]">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)]">Full name</Label>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="email" className="text-sm font-medium text-[var(--main)]">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[var(--main)]">Phone</Label>
                <Input
                  type="phone"
                  id="phone"
                  name="phone"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="citizenid" className="text-sm font-medium text-[var(--main)]">Citizen ID</Label>
                <Input
                  type="text"
                  id="citizenid"
                  name="citizenid"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full mb-[15px] *:not-first:mt-2">
              <Label htmlFor="gender" className="text-sm font-medium text-[var(--main)]">Gender</Label>
              <Select defaultValue="male">
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="date" className="text-sm font-medium text-[var(--main)]">Date of birth</Label>
              <DropdownMenu open={openDialog} onOpenChange={setOpenDialog}>
                <DropdownMenuTrigger asChild>
                  <Button id="date" className="justify-start cursor-pointer bg-white hover:bg-white text-black border border-gray-300 shadow-none text-left">
                    {date.toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Calendar
                    className="rounded-md border p-2"
                    value={date}
                    onChange={(date) => {
                      setDate(date);
                      setOpenDialog(false);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}