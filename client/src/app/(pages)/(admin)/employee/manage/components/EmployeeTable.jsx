"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { DeleteButton } from "@/app/(pages)/components/Button/DeleteButton";
import PaginationComponent from "@/components/common/Pagination";
import { EmployeeRowSkeleton } from "./EmployeeRowSkeleton";
export const EmployeeTable = ({ keyword }) => {
  const [loading, setLoading] = useState(true);
  const [paginationList, setPaginationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const [employeeList, setEmployeeList] = useState([])
  useEffect(() => {


    const fetchData = async () => {
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/employee/list`, {
        keyword: keyword || undefined,
        page: currentPage,
      });
      const promise = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await promise.json();
      if (data.totalPages < currentPage) {
        setCurrentPage(1);
      }

      setEmployeeList(data.employeeList);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    };
    fetchData();
  }, [currentPage, keyword]);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Full name</th>
              <th className="px-4 py-2 text-left">Date of birth</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Manager</th>
              <th className="px-4 py-2 text-left">Current work</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {employeeList.length > 0 ? employeeList.map((item, index) => (
              <tr className="border-t" key={index}>
                <td className="px-4 py-2">{item.employee_name}</td>
                <td className="px-4 py-2">{formatDate(item.date_of_birth)}</td>
                <td className="px-4 py-2 capitalize">{item.gender}</td>
                <td className="px-4 py-2">{item.manager_name || "-"}</td>
                <td className="px-4 py-2">
                  {item.working_branch ? (
                    <Badge variant={"destructive"}>{`${item.working_branch}`}</Badge>
                  ) : (
                    <>-</>
                  )}
                </td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/employee/manage/update/${item.employee_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/employee/manage/assign/${item.employee_id}`)}>Assign</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/employee/delete/${item.employee_id}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : loading ? (
              [...Array(10)].map((_, index) => (<EmployeeRowSkeleton key={index} />))
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        {totalCount > 0 ?
        (
        <>
          <p className="grow text-sm text-muted-foreground" aria-live="polite">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
          <p className="grow text-sm text-muted-foreground text-right" aria-live="polite">
            Total Employees: <span className="text-foreground">{totalCount}</span>
          </p>
        </>
        )
        :
        (<p className="grow text-sm text-muted-foreground" aria-live="polite">
          No employees found.
        </p>)
        }
        <PaginationComponent
          numberOfPages={totalPages}
          currentPage={currentPage}
          controlPage={(value) => setCurrentPage(value)}
        />
      </div>
    </>
  )
}