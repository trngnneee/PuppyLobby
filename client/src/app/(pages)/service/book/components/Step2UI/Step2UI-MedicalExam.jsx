import { Label } from "@/components/ui/label"
import { SectionHeader } from "../SectionHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/utils/date"
import { Calendar } from "@/components/ui/calendar-rac"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Step2UIMedicalExam = ({
  availableBranch, petList, availableEmployee,
  date, setDate,
  branch, setBranch,
  pet, setPet,
  employee, setEmployee
}) => {

  return (
    <>
      <SectionHeader title={"Step 2: Medical Examination Details"} />
      <div className="mt-5">
        <div className="mb-3">Please provide the following details for the medical examination:</div>
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
      </div>
    </>
  )
}