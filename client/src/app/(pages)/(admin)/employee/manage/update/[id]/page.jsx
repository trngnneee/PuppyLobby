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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmployeeCreatePage() {
  const [type, setType] = useState("employee");
  const [date, setDate] = useState(new Date());
  const [gender, setGender] = useState("male");
  const [managerID, setManagerID] = useState("1");
  const [submit, setSubmit] = useState(false);
  const { id } = useParams();
  const [employeeDetail, setEmployeeDetail] = useState(null);
  const router = useRouter();

  const handleCalendarChange = (
    _value,
    _e,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    };
    _e(_event);
  };

  const [managerList, setManagerList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/manager/list`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setManagerList(data.managerList);
          }
        })
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/detail/${id}`)
        .then(res => res.json())
        .then((data) => {
          if (data.code == "success") {
            setEmployeeDetail(data.employeeDetail);
            setDate(new Date(data.employeeDetail.date_of_birth));
            setGender(data.employeeDetail.gender);
            setManagerID(data.employeeDetail.manager_id);
            if (data.employeeDetail.degree) {
              setType("veterinarian");
            }
          }
        })
    }
    fetchData();
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submit) {
      const finalData = {
        type,
        fullname: e.target.fullname.value,
        date_of_birth: date.toISOString().split('T')[0],
        gender,
        managerID: managerID === "manager" ? null : managerID,
        degree: type === "veterinarian" ? e.target.degree.value : null,
        specialization: type === "veterinarian" ? e.target.specialization.value : null,
      }

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }).then(res => res.json())
        .then((data) => {
          return data;
        })

      toast.promise(promise, {
        loading: "Updating employee...",
        success: (data) => {
          if (data.code === "success") {
            setTimeout(() => {
              router.push('/employee/manage');
            }, 1000)
            return data.message;
          }
          else {
            return Promise.reject(data);
          }
        },
        error: (data) => data.message,
      });
      setSubmit(false);
    }
  }

  return (
    <>
      <SectionHeader title={`Update Employee ${employeeDetail && employeeDetail.employee_name}`} />
      <form className="mt-[30px]" id="employeeUpdateForm" onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)]">Choose an employee type</Label>
                <Select value={type} onValueChange={setType}>
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
                  defaultValue={employeeDetail ? employeeDetail.employee_name : ""}
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
                      captionLayout="dropdown"
                      className="rounded-md border p-2"
                      classNames={{
                        month_caption: "mx-0",
                      }}
                      components={{
                        Dropdown: (props) => {
                          return (
                            <Select
                              onValueChange={(value) => {
                                if (props.onChange) {
                                  handleCalendarChange(value, props.onChange);
                                }
                              }}
                              value={String(props.value)}
                            >
                              <SelectTrigger className="h-8 w-fit font-medium first:grow">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                                {props.options?.map((option) => (
                                  <SelectItem
                                    disabled={option.disabled}
                                    key={option.value}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        },
                        DropdownNav: (props) => {
                          return (
                            <div className="flex w-full items-center gap-2">
                              {props.children}
                            </div>
                          );
                        },
                      }}
                      defaultMonth={new Date()}
                      hideNavigation
                      mode="single"
                      onSelect={setDate}
                      selected={date}
                      startMonth={new Date(1980, 6)}
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
                <Select value={managerID != null ? managerID : "manager"} onValueChange={setManagerID}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder={"Manager"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager" onClick={() => setManagerID("")}>Sign this Employee to be Manager</SelectItem>
                    {managerList.length > 0 && managerList.map((manager, index) => (
                      manager.employee_id != id && <SelectItem key={index} value={manager.employee_id.toString()}>{manager.employee_name}</SelectItem>
                    ))}
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
                      defaultValue={employeeDetail && employeeDetail.degree}
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
                      defaultValue={employeeDetail && employeeDetail.specialization}
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