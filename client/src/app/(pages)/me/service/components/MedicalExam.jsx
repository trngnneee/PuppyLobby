"use client"

import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { MedicalItem } from "./MedicalItem"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuthContext } from "@/provider/auth.provider"
import { paramsBuilder } from "@/utils/params"
import PaginationComponent from "@/components/common/Pagination"
import { MedicalItemSkeleton } from "./MedicalItemSkeleton"

export const MedicalExam = () => {
  const { userInfo } = useAuthContext();
  const [medicalExamList, setMedicalExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (!userInfo) return;
    const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/list-customer/${userInfo.customer_id}`, {
      page: currentPage,
    });
    const fetchData = async () => {
      await fetch(url, {
        method: "GET"
      })
        .then((res) => res.json())
        .then((data) => {
          setMedicalExamList(data.medicalExamList);
          setLoading(false);
          setTotalPages(data.totalPages);
        });
    }
    fetchData();
  }, [userInfo, currentPage]);

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-5">
        {medicalExamList.length > 0 ? medicalExamList.map((item, index) => (
          <div key={index} className="mb-4">
            <MedicalItem item={item} />
          </div>
        )) : !loading ? <p>No medical exams found.</p> : (
          [...Array(4)].map((_, index) => (
            <MedicalItemSkeleton key={index} />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <PaginationComponent
          numberOfPages={totalPages}
          currentPage={currentPage}
          controlPage={(value) => setCurrentPage(value)}
        />
      )}
    </>
  )
}