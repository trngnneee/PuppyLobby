"use client"

import { useAuthContext } from "@/provider/auth.provider";
import { SectionHeader } from "../components/SectionHeader";
import { useEffect, useState } from "react";
import { BookingItem } from "../components/BookingItem";

export default function VaccinePackagePage() {
  const { userInfo } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  useEffect(() => {
    if (!userInfo) return;
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-package/list/${userInfo.employee_id}`).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setVaccinePackageList(data.vaccinePackageList);
          setLoading(false);
        }
      })
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <SectionHeader title={`Vaccine Package Management`} />
      <div className="grid grid-cols-3 gap-5 mt-5">
        {loading ? (
          <div>Loading...</div>
        ) : (
          vaccinePackageList.length > 0 ? vaccinePackageList.map((item) => (
            <BookingItem key={item.booking_id} item={item} base_url={'/work/manage/vaccine-package'} />
          )) : (
            <div className="text-sm text-gray-400 mt-5">No vaccine package found.</div>
          )
        )}
      </div>
    </>
  )
}