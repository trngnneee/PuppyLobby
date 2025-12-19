"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { paramsBuilder } from "@/utils/params";
import { DeleteButton } from "@/app/(pages)/components/Button/DeleteButton";
import PaginationComponent from "@/components/common/Pagination";
import { VaccinePackageRowSkeleton } from "./VaccinePackageRowSkeleton";
export const VaccinePackageTable = ({ keyword }) => {
  const router = useRouter();

  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    

    const fetchData = async () => {
      setLoading(true);
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/list`, {
        page: currentPage,
        keyword: keyword,
      });
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setVaccinePackageList(data.vaccinePackageList);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
            setLoading(false);
            if (totalPages < currentPage) {
              setCurrentPage(1);
            }
          }
        })

    }
    fetchData();
  }, [currentPage, keyword, totalPages]);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Discount rate</th>
              <th className="px-4 py-2 text-left">Original price</th>
              <th className="px-4 py-2 text-left">Schedule</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {vaccinePackageList.length > 0 ? vaccinePackageList.map((item) => (
              <tr key={item.vaccine_package_info.package_id} className="border-t">
                <td className="px-4 py-2">{item.vaccine_package_info.package_name}</td>
                <td className="px-4 py-2">{item.vaccine_package_info.duration} months</td>
                <td className="px-4 py-2">{item.vaccine_package_info.discount_rate}%</td>
                <td className="px-4 py-2">{parseInt(item.vaccine_package_info.total_original_price).toLocaleString("vi-VN")} VND</td>
                <td className="px-4 py-2">
                  {item.vaccine_package_info.schedule.map((s, index) => (
                    <div key={index}>
                      {s.vaccine_name} - {s.dosage} ml - {s.scheduled_week} weeks
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/vaccine-package/manage/update/${item.vaccine_package_info.package_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/delete/${item.vaccine_package_info.package_id}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : loading ? (
              [...Array(3)].map((_, index) => (
                <VaccinePackageRowSkeleton key={index} />
              ))
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        {totalCount > 0 ?
        <p className="grow text-sm text-muted-foreground" aria-live="polite">
          Page <span className="text-foreground">{currentPage}</span> of{" "}
          <span className="text-foreground">{totalPages}</span>
        </p>
        :
        <div className="grow">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            No vaccine packages found.
          </p>
        </div>
        }
        <div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Total vaccine packages: <span className="text-foreground">{totalCount}</span>
          </p>
        </div>
        <PaginationComponent
          numberOfPages={totalPages}
          currentPage={currentPage}
          controlPage={(value) => setCurrentPage(value)}
        />
      </div>
    </>
  )
}