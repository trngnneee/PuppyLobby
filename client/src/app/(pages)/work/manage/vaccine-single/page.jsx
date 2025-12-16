"use client"

import { useEffect, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { useAuthContext } from "@/provider/auth.provider";
import { BookingItem } from "../components/BookingItem";

export default function VaccineSinglePage() {
  const { userInfo } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [vaccineSingleList, setVaccineSingleList] = useState([]);
  useEffect(() => {
    if (!userInfo) return;
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-single/list/${userInfo.employee_id}`).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setVaccineSingleList(data.vaccineSingleList);
          setLoading(false);
        }
      })
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <SectionHeader title={`Vaccine Single Management`} />
      <div className="grid grid-cols-3 gap-5 mt-5">
        {loading ? (
          <div>Loading...</div>
        ) : (
          vaccineSingleList.length > 0 ? vaccineSingleList.map((item) => (
            <BookingItem key={item.booking_id} item={item} base_url={'/work/manage/vaccine-single'} />
          )) : (
            <div className="text-sm text-gray-400 mt-5">No vaccine single found.</div>
          )
        )}
      </div>
    </>
  )
}