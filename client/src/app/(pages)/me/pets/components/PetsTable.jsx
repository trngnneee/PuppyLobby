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
import { useEffect, useState } from "react";
import { healthStatusOptions, speciesOptions } from "@/config/variable.config";
import { paramsBuilder } from "@/utils/params";
import { DeleteButton } from "@/app/(pages)/components/Button/DeleteButton";

export const PetsTable = ({ keyword }) => {
  const router = useRouter();

  const [petList, setPetList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/pet/list`, {
        page: currentPage,
        keyword: keyword
      });
      const promise = await fetch(url, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      if (promise.code === "success") {
        setPetList(promise.petList);
        setTotalPages(promise.totalPages);
      }
    };
    fetchData();
  }, [currentPage, keyword])

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Species</th>
              <th className="px-4 py-2 text-left">Breed</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Health Status</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {petList.length > 0 && petList.map((item, index) => (
              <tr className="border-t" key={index}>
                <td className="px-4 py-2">{item.pet_name}</td>
                <td className="px-4 py-2">{speciesOptions.find((opt) => opt.value == item.species)?.label}</td>
                <td className="px-4 py-2">{item.breed}</td>
                <td className="px-4 py-2">{item.age}</td>
                <td className="px-4 py-2 capitalize">{item.gender}</td>
                <td className="px-4 py-2">
                  {item.health_state === "healthy" ? (
                    <Badge variant="success">{healthStatusOptions.find((opt) => opt.value == item.health_state)?.label}</Badge>
                  ) : item.health_state === "sick" ? (
                    <Badge variant="destructive">{healthStatusOptions.find((opt) => opt.value == item.health_state)?.label}</Badge>
                  ) : (
                    <Badge variant="warning">{healthStatusOptions.find((opt) => opt.value == item.health_state)?.label}</Badge>
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
                      <DropdownMenuItem onClick={() => router.push(`/me/pets/update/${item.pet_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/pet/delete/${item.pet_id}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="cursor-pointer"
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className="cursor-pointer"
                >
                  Next
                </a>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};  