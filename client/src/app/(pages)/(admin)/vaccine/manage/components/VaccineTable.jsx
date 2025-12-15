"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { DeleteButton } from "@/app/(pages)/components/Button/DeleteButton";
import { VaccineItemSkeleton } from "./VaccineItemSkeleton";

export const VaccineTable = ({ keyword }) => {
  const router = useRouter();

  const [vaccineList, setVaccineList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      setVaccineList([]);
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/list`, {
        page: currentPage,
        keyword: keyword,
      });
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setVaccineList(data.vaccineList);
            setTotalPages(data.totalPages);
          }
        });
    }
    fetchData();
  }, [currentPage, keyword])

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Manufacture date</th>
              <th className="px-4 py-2 text-left">Entry date</th>
              <th className="px-4 py-2 text-left">Expire date</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {vaccineList.length > 0 ? vaccineList.map((item) => (
              <tr key={item.vaccine_id} className="border-t">
                <td className="px-4 py-2">{item.vaccine_name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.price}</td>
                <td className="px-4 py-2">{formatDate(item.manufacture_date)}</td>
                <td className="px-4 py-2">{formatDate(item.entry_date)}</td>
                <td className="px-4 py-2">{formatDate(item.expiry_date)}</td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/vaccine/manage/update/${item.vaccine_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/vaccine/delete/${item.vaccine_id}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : [...Array(10)].map((_, index) => (
              <VaccineItemSkeleton key={index} />
            ))}
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