"use client"

import { useAuthContext } from "@/provider/auth.provider"
import { SectionHeader } from "../components/SectionHeader";
import { useEffect, useState } from "react";
import { MedicalExamItem } from "./components/MedicalExamItem";

export default function MedicalExamPage() {
  const { userInfo } = useAuthContext();

  const [medicalExamList, setMedicalExamList] = useState([]);
  useEffect(() => {
    if (!userInfo) return;
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/list/${userInfo.employee_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setMedicalExamList(data.medicalExamList);
          }
        })
    };
    fetchData();
  }, [userInfo]);

  return (
    <>
      <SectionHeader title={`Medical Exam Management`} />
      <div className="grid grid-cols-3 gap-5 mt-5">
        {medicalExamList.length > 0 ? medicalExamList.map((item) => (
          <MedicalExamItem key={item.booking_id} item={item} />
        )) : (
          <div className="text-sm text-gray-400 mt-5">No medical examination found.</div>
        )}
      </div>
    </>
  )
}