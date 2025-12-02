"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils/date";
import JustValidate from "just-validate";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployeeCreatePage() {
  const [type, setType] = useState("employee");
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [managerID, setManagerID] = useState("1");
  const [submit, setSubmit] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const validation = new JustValidate('#employeeUpdateForm');

    validation.addField('#fullname', [
      {
        rule: 'required',
        errorMessage: 'Full name is required',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Full name must be at least 3 characters',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Full name must be at most 50 characters',
      },
    ])
      .addField('#date_of_birth', [
        {
          rule: 'required',
          errorMessage: 'Date of birth is required',
        },
      ]);

    if (type === "veterinarian") {
      validation
        .addField('#degree', [
          { rule: 'required', errorMessage: 'Degree is required' },
          { rule: 'minLength', value: 2, errorMessage: 'Degree must be at least 2 chars' },
        ])
        .addField('#specialization', [
          { rule: 'required', errorMessage: 'Specialization is required' },
          { rule: 'minLength', value: 2, errorMessage: 'Specialization must be at least 2 chars' },
        ]);
    }

    validation.onSuccess(() => {
      setSubmit(true);
    })
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const fullname = e.target.fullname.value;
      const date_of_birth = date.toISOString().split('T')[0];
      console.log({
        fullname,
        date_of_birth,
        gender,
        managerID
      })
      if (type === "veterinarian") {
        const degree = e.target.degree.value;
        const specialization = e.target.specialization.value;
        console.log({
          degree,
          specialization
        })
      }
    }
  }

  return (
    <>
      <SectionHeader title={`Update Employee ${id}`} />
      <form className="mt-[30px]" id="employeeUpdateForm" onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)]">Choose an employee type</Label>
                <Select defaultValue={type} onValueChange={setType}>
                  <SelectTrigger id="employeeType">
                    <SelectValue placeholder="Employee Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Normal Employee</SelectItem>
                    <SelectItem value="veterinarian">Veterinarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
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
                <Label htmlFor="date_of_birth" className="text-sm font-medium text-[var(--main)]">Date of birth</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formatDate(date)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="gender" className="text-sm font-medium text-[var(--main)]">Gender</Label>
                <Select defaultValue={gender} onValueChange={setGender}>
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
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="manager" className="text-sm font-medium text-[var(--main)]">Manager</Label>
                <Select defaultValue={managerID} onValueChange={setManagerID}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">M1</SelectItem>
                    <SelectItem value="2">M2</SelectItem>
                    <SelectItem value="3">M3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {type == "veterinarian" && (
          <>
            <div className="mt-5">
              <div className="flex gap-10">
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="degree" className="text-sm font-medium text-[var(--main)]">Degree</Label>
                    <Input
                      type="text"
                      id="degree"
                      name="degree"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="specialization" className="text-sm font-medium text-[var(--main)]">Specialization</Label>
                    <Input
                      type="text"
                      id="specialization"
                      name="specialization"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}