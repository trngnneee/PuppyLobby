"use client"

import { Label } from "@/components/ui/label";
import { SectionHeader } from "../components/SectionHeader";
import AvatarUploader from "./components/AvatarUploader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date"
import { Calendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import JustValidate from "just-validate";

export default function MeProfilePage() {
  const [avatar, setAvatar] = useState(null);
  const [gender, setGender] = useState("male");
  const [date, setDate] = useState(today(getLocalTimeZone()))
  const [openDialog, setOpenDialog] = useState(false);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const validation = new JustValidate("#profile-form");
    validation
      .addField("#fullname", [
        {
          rule: "required",
          errorMessage: "Full name is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Full name must be at least 3 characters",
        }
      ])
      .addField("#phone", [
        {
          rule: "required",
          errorMessage: "Phone is required",
        },
        {
          rule: 'customRegexp',
          value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          errorMessage: 'Phone number is not valid',
        }
      ])
      .addField("#citizenid", [
        {
          rule: "required",
          errorMessage: "Citizen ID is required",
        },
        {
          rule: "minLength",
          value: 9,
          errorMessage: "Citizen ID must be at least 9 characters",
        }
      ])
      .onSuccess(() => {
        setSubmit(true);
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const fullname = e.target.fullname.value;
      const phone = e.target.phone.value;
      const citizenid = e.target.citizenid.value;
      const dateOfBirth = date.toString();
      console.log({ avatar, fullname, phone, citizenid, gender, dateOfBirth });
    }
  }

  return (
    <>
      <SectionHeader title="Profile" />
      <form onSubmit={handleSubmit} className="" id="profile-form">
        <div className="mt-[30px]">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="username" className="text-sm font-medium text-[var(--main)]">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  readOnly
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-center">
                <AvatarUploader
                  avatar={avatar}
                  setAvatar={setAvatar}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
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
                  readOnly
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
                  <SelectItem onClick={() => setGender("male")} value="male">Male</SelectItem>
                  <SelectItem onClick={() => setGender("female")} value="female">Female</SelectItem>
                  <SelectItem onClick={() => setGender("other")} value="other">Other</SelectItem>
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
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}