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

export const VaccinePackageTable = () => {
  const currentPage = 1;
  const totalPages = 5;
  const router = useRouter();
  
  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Discount rate</th>
              <th className="px-4 py-2 text-left">Original price</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">P001</td>
              <td className="px-4 py-2">Vaccine Package A</td>
              <td className="px-4 py-2">12 months</td>
              <td className="px-4 py-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</td>
              <td className="px-4 py-2">10%</td>
              <td className="px-4 py-2">$100</td>
              <td className="px-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push('/vaccine-package/manage/update/1')}>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
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