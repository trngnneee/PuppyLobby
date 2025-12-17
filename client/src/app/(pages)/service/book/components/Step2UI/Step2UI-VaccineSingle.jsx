"use client"

import { Label } from "@/components/ui/label"
import { SectionHeader } from "../SectionHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar-rac"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/utils/date"
import { VaccineItem } from "./VaccineItem/VaccineItem"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { paramsBuilder } from "@/utils/params"
import { RadioGroup } from "@/components/ui/radio-group"
import { VaccineItemSkeleton } from "./VaccineItem/VaccineItemSkeleton"
import { getPagination } from "@/utils/pagination"

export const Step2UIVaccineSingle = ({
  petList, availableBranch, availableEmployee,
  date, setDate,
  pet, setPet,
  branch, setBranch,
  employee, setEmployee,
  vaccine, setVaccine
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationList, setPaginationList] = useState([]);

  const [vaccineList, setVaccineList] = useState([]);
  useEffect(() => {
    const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/list`, {
      page: currentPage
    })
    const fetchData = async () => {
      setVaccineList([]);
      await fetch(url).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setVaccineList(data.vaccineList);
          setTotalPages(data.totalPages);
          setVaccine(data.vaccineList.length > 0 ? data.vaccineList[0].vaccine_id : null);
          setPaginationList(getPagination(currentPage, data.totalPages))
        }
      });
    }
    fetchData();
  }, [currentPage])

  return (
    <>
      <SectionHeader title={"Step 2: Vaccine Single Service Details"} />
      <div className="mt-5">
        <div className="mb-3">Please provide the following details for the vaccine single service:</div>
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
        <div className="mt-5 mb-3">Please choose the type of vaccine:</div>
        <div className="">
          <RadioGroup
            value={vaccine}
            onValueChange={setVaccine}
            className="grid grid-cols-5 gap-3"
          >
            {vaccineList.length > 0 ? vaccineList.map((item) => (
              <VaccineItem
                key={item.vaccine_id}
                item={item}
              />
            )) : (
              [...Array(10)].map((_, index) => (
                <VaccineItemSkeleton key={index} />
              ))
            )}
          </RadioGroup>
          <div className="flex items-center justify-between gap-3 mt-5">
            <p className="grow text-sm text-muted-foreground" aria-live="polite">
              Page <span className="text-foreground">{currentPage}</span> of{" "}
              <span className="text-foreground">{totalPages}</span>
            </p>
            <Pagination className="w-auto">
              <PaginationContent className="gap-3">
                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    aria-disabled={currentPage === 1 ? true : undefined}
                    role={currentPage === 1 ? "link" : undefined}
                    asChild
                  >
                    <a
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </a>
                  </Button>
                </PaginationItem>

                {paginationList.map((item, index) => (
                  (item != '...') ? (
                    <PaginationItem key={index}>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(item)}
                        className={item === currentPage ? "bg-gray-100" : ""}
                      >
                        {item}
                      </Button>
                    </PaginationItem>
                  ) : (
                    <PaginationEllipsis key={index} />
                  )
                ))}

                <PaginationItem>
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    aria-disabled={currentPage === totalPages ? true : undefined}
                    role={currentPage === totalPages ? "link" : undefined}
                    asChild
                  >
                    <a
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </a>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  )
}