import { formatDate } from "@/utils/date"
import { SectionHeader } from "../SectionHeader"

export const Step3UIVaccineSingle = ({
  service_name,
  date,
  branch,
  pet,
  employee,
  vaccine
}) => {
  return (
    <>
      <SectionHeader title={"Step 3: Single Vaccine Service Information Checking"} />
      <div className="mt-5">
        <div className="mb-3">Please check the following details of your Single Vaccine Service:</div>
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="w-1/3 px-4 py-2 font-bold">
                Service Type
              </td>
              <td className="px-4 py-2">
                {service_name}
              </td>
            </tr>

            <tr className="border-b">
              <td className="px-4 py-2 font-bold">
                Date
              </td>
              <td className="px-4 py-2">
                {formatDate(date)}
              </td>
            </tr>

            <tr className="border-b">
              <td className="px-4 py-2 font-bold">
                Branch
              </td>
              <td className="px-4 py-2">
                {branch}
              </td>
            </tr>

            <tr className="border-b">
              <td className="px-4 py-2 font-bold">
                Pet
              </td>
              <td className="px-4 py-2">
                {pet}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-2 font-bold">
                Employee
              </td>
              <td className="px-4 py-2">
                {employee}
              </td>
            </tr>
            
            <tr>
              <td className="px-4 py-2 font-bold">
                Vaccine ID
              </td>
              <td className="px-4 py-2">
                {vaccine}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}