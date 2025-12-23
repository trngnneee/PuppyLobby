"use client"

import PaginationComponent from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/provider/auth.provider";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { useEffect, useState } from "react";

export const VaccinationPackageService = () => {
  const { userInfo } = useAuthContext();
  const [vaccinationList, setMedicalExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (!userInfo) return;
    const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-package/list-customer/${userInfo.customer_id}`, {
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
              <th className="px-4 py-3 text-left">Package name</th>
              <th className="px-4 py-3 text-left">Start date</th>
              <th className="px-4 py-3 text-left">End date</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Schedule</th>
            </tr>
          </thead>

          <tbody>
            {vaccinationList.length > 0 && vaccinationList.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{item.pet_name}</td>
                <td className="px-4 py-3">{item.package_name}</td>
                <td className="px-4 py-3">{formatDate(item.start_date)}</td>
                <td className="px-4 py-3">{formatDate(item.end_date)}</td>
                <td className="px-4 py-3">{item.duration}</td>
                <td className="px-4 py-3">
                  {item.status == "completed" ? (
                    <Badge variant="">Completed</Badge>
                  ) : item.status == "pending" ? (
                    <Badge variant="destructive">Pending</Badge>
                  ) : <Badge variant="secondary">In Progress</Badge>}
                </td>

                <td className="px-4 py-3">
                  <Badge className={"bg-[var(--main)] hover:bg-[var(--main-hover)]"}>
                    {item.employee_name}
                  </Badge>
                </td>
                <td className="px-4 py-3 w-[250px]">
                  <ol className="list-decimal pl-5">
                    {item.schedules && item.schedules.map((schedule, idx) => (
                      <li key={idx}>
                        {`Week ` + schedule.scheduled_week}: {schedule.vaccine_name}
                      </li>
                    ))}
                  </ol>
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
