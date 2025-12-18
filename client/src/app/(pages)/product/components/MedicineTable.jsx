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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { DeleteButton } from "@/app/(pages)/components/Button/DeleteButton";
import { ProductRowSkeleton } from "./ProductRowSkeleton";
import { speciesOptions } from "@/config/variable.config";
import PaginationComponent from "@/components/common/Pagination";
import { ProductCard } from "./ProductCard";
export const MedicineTable = ({searchKey}) => {
  const router = useRouter();

  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/product/product_types`, {
        type: 'medicine',
        page: currentPage,
        search: searchKey,
      });
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setProductList(data.productList);
            setTotalCount(data.totalCount);
            setTotalPages(data.totalPages);
            if (searchKey){
              setCurrentPage(1);
            }
          }
        })
      setIsLoading(false);
    }
    fetchData();
  }, [currentPage, searchKey]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-[36px] font-semibold text-gray-900 mb-2">
            Pet Medicine
          </h1>

          <p className="text-[16px] text-gray-600">
            Safe and effective healthcare solutions for your pets
          </p>
        </div>


        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : productList.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-8 mb-8">
              {productList.map((item, index) => (
                <ProductCard key={item.product_info?.id || index} item={item} index={index} />
              ))}
            </div>

            {/* Pagination */}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}