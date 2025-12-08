"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate, formatDateReverse } from "@/utils/date";
import { Button } from "@/components/ui/button";
import JustValidate from "just-validate";
import { toast } from "sonner";

export default function AssignEmployeePage() {
  const { id } = useParams();
  const [branchID, setBranchID] = useState("");
  const now = today(getLocalTimeZone());
  const [date, setDate] = useState({
    end: now.add({ days: 3 }),
    start: now,
  });

  const [submit, setSubmit] = useState(false);
  const router = useRouter();

  const [branchList, setBranchList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/list`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success")
          {
            setBranchList(data.branchList);
          }
        })

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success")
          {
            setEmployeeName(data.employeeDetail.employee_name);
          }
        })
    }
    fetchData();
  }, [])

  useEffect(() => {
    const validation = new JustValidate('#assignEmployeeForm');

    validation
      .addField('#branch', [
        {
          rule: 'required',
          errorMessage: 'Branch is required',
        }
      ])
      .addField('#position', [
        {
          rule: 'required',
          errorMessage: 'Position is required',
        }
      ])
      .addField('#salary', [
        {
          rule: 'required',
          errorMessage: 'Salary is required',
        },
        {
          rule: 'number',
          errorMessage: 'Salary must be a number',
        },
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Salary must be at least 0',
        }
      ])
      .onSuccess(async (event) => {
        setSubmit(true);
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit)
    {
      const position = e.target.position.value;
      const start_date = formatDateReverse(date.start);
      const end_date = formatDateReverse(date.end);
      const salary = e.target.salary.value;

      const finalData = {
        branch_id: branchID,
        employee_id: id,
        position: position,
        start_date: start_date,
        end_date: end_date,
        salary: salary
      };

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }).then((res) => res.json())
      .then((data) => {
        return data;
      })
      
      toast.promise(promise, {
        loading: 'Assigning employee...',
        success: (data) => {
          if (data.code == "success")
          {
            setTimeout(() => {
              router.push('/employee/manage');
            }, 1000)
            return data.message;
          }
          else return Promise.reject(data.message);
        },
        error: (err) => err,
      })
    }
  }

  return (
    <>
      <SectionHeader title={`Assign work for Employee ${employeeName}`} />
      <form className="mt-[30px]" id="assignEmployeeForm" onSubmit={handleSubmit}>
        <div className="">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label className="text-sm font-medium text-[var(--main)]">Branch</Label>
                <Select defaultValue={branchID} onValueChange={setBranchID}>
                  <SelectTrigger>
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchList.length > 0 && branchList.map((item, index) => (
                      <SelectItem key={index} value={item.branch_id.toString()}>{item.branch_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="hidden" id="branch" name="branch_id" value={branchID} onChange={() => {}} />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="working_date" className="text-sm font-medium text-[var(--main)]">Working date</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Input
                    type="text"
                    id="working_date"
                    name="working_date"
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