"use client"

import { Label } from "@/components/ui/label"
import { SectionHeader } from "../SectionHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar-rac"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/utils/date"
import { RadioGroup } from "@/components/ui/radio-group"
//import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { useEffect, useState } from "react"
import { paramsBuilder } from "@/utils/params"
import { VaccinePackageItem } from "./VaccinePackageItem/VaccinePackageItem"
import { VaccinePackageItemSkeleton } from "./VaccinePackageItem/VaccinePackageItemSkeleton"
import { Button } from "@/components/ui/button"
//import { getPagination } from "@/utils/pagination"
import PaginationComponent from "@/components/common/Pagination"
export const Step2UIVaccinePackage = ({
  availableBranch, petList, availableEmployee,
  date, setDate,
  branch, setBranch,
  pet, setPet,
  employee, setEmployee,
  vaccinePackage, setVaccinePackage
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //const [paginationList, setPaginationList] = useState([]);

  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/list`, {
        page: currentPage,
      });
      await fetch(url).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setVaccinePackageList(data.vaccinePackageList);
          setTotalPages(data.totalPages);
          setVaccinePackage(data.vaccinePackageList.length > 0 ? data.vaccinePackageList[0].package_id : null);
          //setPaginationList(getPagination(currentPage, data.totalPages))
        }
      })
    };
    fetchData();
  }, [currentPage]);

  return (
    <>
      <SectionHeader title={"Step 2: Vaccine Package Details"} />
      <div className="mt-5">
        <div className="mb-3">Please provide the following details for the Vaccine Package Service:</div>
        <div className="flex items-center gap-10">
          <div className="w-full">
            <Label htmlFor="exam_date" className="text-sm font-medium text-[var(--main)]">Examination Date</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Input
                  type="text"
                  id="exam_date"
                  name="exam_date"
                  value={formatDate(date)}
                  readOnly
                  className="cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Calendar
                  onChange={setDate}
                  value={date}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full">
            <Label htmlFor="pet" className="text-sm font-medium text-[var(--main)]">Pet</Label>
            <Select onValueChange={setPet} value={pet}>
              <SelectTrigger>
                <SelectValue placeholder="Select Pet" />
                <SelectContent>
                  {petList.map((pet, index) => (
                    <SelectItem key={index} value={pet.pet_id}>
                      {pet.pet_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-10 mt-10">
          <div className="w-full">
            <Label htmlFor="branch" className="text-sm font-medium text-[var(--main)]">Branch</Label>
            <Select onValueChange={setBranch} value={branch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
                <SelectContent>
                  {availableBranch.map((branch, index) => (
                    <SelectItem key={index} value={branch.branch_id}>
                      {branch.branch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
          <div className="w-full">
            <Label className="text-sm font-medium text-[var(--main)]">Available Employees</Label>
            {availableEmployee.length > 0 ? (
              <Select onValueChange={setEmployee} value={employee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                  <SelectContent>
                    {availableEmployee.map((employee, index) => (
                      <SelectItem key={index} value={employee.employee_id}>
                        {employee.employee_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            ) : (
              <div>
                <div className="mt-2 text-sm text-gray-500">No available employees in this branch for the selected date.</div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 mb-3">Please choose the vaccine package:</div>
        <div>
          <RadioGroup
            value={vaccinePackage}
            onValueChange={setVaccinePackage}
            className="grid grid-cols-3 gap-3"
          >
            {vaccinePackageList.length > 0 ? vaccinePackageList.map((item) => (
              <VaccinePackageItem
                key={item.vaccine_package_info.package_id}
                item={item}
              />
            )) : (
              [...Array(3)].map((_, index) => (
                <VaccinePackageItemSkeleton key={index} />
              ))
            )}
          </RadioGroup>
          <div className="flex items-center justify-between gap-3 mt-5">
            <p className="grow text-sm text-muted-foreground" aria-live="polite">
              Page <span className="text-foreground">{currentPage}</span> of{" "}
              <span className="text-foreground">{totalPages}</span>
            </p>
            <PaginationComponent
              numberOfPages={totalPages}
              currentPage={currentPage}
              controlPage={(value) => setCurrentPage(value)}
            />
          </div>
        </div>
      </div>
    </>
  )
}