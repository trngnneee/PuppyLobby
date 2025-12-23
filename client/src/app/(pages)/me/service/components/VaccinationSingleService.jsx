"use client"

import PaginationComponent from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/provider/auth.provider";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { useEffect, useState } from "react";

export const VaccinationSingleService = () => {
  const { userInfo } = useAuthContext();
  const [vaccinationList, setMedicalExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (!userInfo) return;
    const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-single/list-customer/${userInfo.customer_id}`, {
      page: currentPage,
    });
    const fetchData = async () => {
      await fetch(url, {
        method: "GET"
      })
        .then((res) => res.json())
        .then((data) => {
          setMedicalExamList(data.vaccinationList);
          setLoading(false);
          setTotalPages(data.totalPages);
        });
    };
    fetchData();
  }, [userInfo, currentPage]);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Pet</th>
              <th className="px-4 py-3 text-left">Vaccine</th>
              <th className="px-4 py-3 text-left">Dosage</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Doctor</th>
            </tr>
          </thead>

          <tbody>
            {vaccinationList.length > 0 && vaccinationList.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{item.pet_name}</td>
                <td className="px-4 py-3">{item.vaccine_name}</td>

                <td className="px-4 py-3">{item.dosage}</td>
                <td className="px-4 py-3">
                  {item.status == "completed" ? (
                    <Badge variant="">Completed</Badge>
                  ) : item.status == "pending" ? (
                    <Badge variant="destructive">Pending</Badge>
                  ) : <Badge variant="secondary">In Progress</Badge>}
                </td>
                <td className="px-4 py-3">{formatDate(item.date)}</td>

                <td className="px-4 py-3">
                  <Badge className={"bg-[var(--main)] hover:bg-[var(--main-hover)]"}>
                    {item.employee_name}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationComponent
          numberOfPages={totalPages}
          currentPage={currentPage}
          controlPage={(value) => setCurrentPage(value)}
        />
      )}
    </>
  );
};
