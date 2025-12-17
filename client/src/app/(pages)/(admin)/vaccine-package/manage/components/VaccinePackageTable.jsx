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
import { getPagination } from "@/utils/pagination";
import { VaccinePackageRowSkeleton } from "./VaccinePackageRowSkeleton";

export const VaccinePackageTable = ({ keyword }) => {
  const router = useRouter();

  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationList, setPaginationList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setVaccinePackageList([]);
    const fetchData = async () => {
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
            setPaginationList(getPagination(currentPage, data.totalPages));
            setLoading(false);
          }
        })
    }
    fetchData();
  }, [currentPage, keyword]);

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
              <tr key={item.package_id} className="border-t">
                <td className="px-4 py-2">{item.package_name}</td>
                <td className="px-4 py-2">{item.duration} months</td>
                <td className="px-4 py-2">{item.discount_rate}%</td>
                <td className="px-4 py-2">{parseInt(item.total_original_price).toLocaleString("vi-VN")} VND</td>
                <td className="px-4 py-2">
                  {item.schedule.map((s, index) => (
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
                      <DropdownMenuItem onClick={() => router.push(`/vaccine-package/manage/update/${item.package_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/delete/${item.package_id}`}
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
    </>
  )
}