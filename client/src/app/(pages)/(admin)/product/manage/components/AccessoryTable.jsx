"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const AccessoryTable = () => {
  const currentPage = 1;
  const totalPages = 5;
  const router = useRouter();
  
  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-[10px]">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left text-nowrap">Manufacture date</th>
              <th className="px-4 py-2 text-left text-nowrap">Entry date</th>
              <th className="px-4 py-2 text-left text-nowrap">Expire date</th>
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Color</th>
              <th className="px-4 py-2 text-left">Materials</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">A001</td>
              <td className="px-4 py-2">Adjustable Nylon Collar</td>
              <td className="px-4 py-2">120000</td>
              <td className="px-4 py-2 text-nowrap">2024-05-12</td>
              <td className="px-4 py-2 text-nowrap">2024-06-01</td>
              <td className="px-4 py-2 text-nowrap">-</td>
              <td className="px-4 py-2">120kg</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap">
                  <Badge className="mr-1 mb-1 text-[8px]">Dog</Badge>
                  <Badge className="mr-1 mb-1 text-[8px]">Cat</Badge>
                  <Badge className="mr-1 mb-1 text-[8px]">Bird</Badge>
                </div>
              </td>
              <td className="px-4 py-2">Durable nylon collar with adjustable buckle and metal ring.</td>
              <td className="px-4 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push('/product/manage/update/1')}>Edit</DropdownMenuItem>
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