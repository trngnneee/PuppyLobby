"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
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
import { ProductRowSkeleton } from "./ProductRowSkeleton";
import PaginationComponent from "@/components/common/Pagination";

export const AccessoryTable = ({searchKey}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setProductList([]);
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/product/product_types`, {
        page: currentPage,
        type: 'accessory',
        search: searchKey,
      });
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setProductList(data.productList);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
            if (searchKey){
              setCurrentPage(1);
            }
          }
        })
      setIsLoading(false);
    }

    fetchData();

  }, [currentPage, searchKey])

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-[10px]">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Image</th>
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
            {productList.length > 0 ? productList.map((item, index) => 
              (<tr key={index} className="border-t">
                <td className="px-4 py-2">{item.product_info.product_name}</td>
                <td className="px-4 py-2">
                  <img
                    src={item.product_info.images[0]}
                    className="w-[50px] h-[50px] object-cover"
                    loading ="lazy"
                  />
                </td>
                <td className="px-4 py-2">{parseInt(item.product_info.price).toLocaleString("vi-VN")}</td>
                <td className="px-4 py-2 text-nowrap">{formatDate(item.product_info.manufacture_date)}</td>
                <td className="px-4 py-2 text-nowrap">{formatDate(item.product_info.entry_date)}</td>
                <td className="px-4 py-2 text-nowrap">{formatDate(item.product_info.expiry_date)}</td>
                <td className="px-4 py-2">{item.extra_info.size}</td>
                <td className="px-4 py-2">{item.extra_info.color}</td>
                <td className="px-4 py-2">{item.extra_info.material}</td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/product/manage/update/${item.product_info.product_id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeleteButton
                          api={`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${item.product_info.product_id}`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>)
              ) 
              :
              (
                isLoading ? 
                (
                  [...Array(5)].map((_, index) => (
                    <ProductRowSkeleton key={index} />
                  ))
                )
                :
                (
                  <tr className ="text-center text-xl text-muted-foreground">
                    <td colSpan={10} className = "p-5">No result</td>
                  </tr>
                )
                
              )
            }
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        {totalCount > 0 ?
        <p className="grow text-sm text-muted-foreground" aria-live="polite">
          Page <span className="text-foreground">{currentPage}</span> of{" "}
          <span className="text-foreground">{totalPages}</span>
        </p>
        : null}
        <p className="grow text-sm text-muted-foreground text-right" aria-live="polite">
          Total Items: <span className="text-foreground">{totalCount}</span>
        </p>

        <PaginationComponent
          numberOfPages={totalPages}
          currentPage={currentPage}
          controlPage={(value) => setCurrentPage(value)}
        />
      </div>
    </>
  )
}