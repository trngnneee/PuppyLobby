"use client"

import { useAuthContext } from "@/provider/auth.provider"
import { SectionHeader } from "../components/SectionHeader";
import { useEffect, useState } from "react";
import { BookingItem } from "../components/BookingItem";

export default function MedicalExamPage() {
  const { userInfo } = useAuthContext();

  const [medicalExamList, setMedicalExamList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userInfo) return;
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/list/${userInfo.employee_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setMedicalExamList(data.medicalExamList);
            setLoading(false);
          }
        })
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <SectionHeader title={`Medical Exam Management`} />
      <div className="grid grid-cols-3 gap-5 mt-5">
        {loading ? (
          <div>Loading...</div>
        ) : (
          medicalExamList.length > 0 ? medicalExamList.map((item) => (
            <BookingItem key={item.booking_id} item={item} base_url={'/work/manage/medical-exam'} />
          )) : (
            <div className="text-sm text-gray-400 mt-5">No medical examination found.</div>
          )
        )}
      </div>
    </>
  )
}