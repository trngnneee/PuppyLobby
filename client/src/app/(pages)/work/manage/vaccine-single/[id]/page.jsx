"use client"

import { useParams, useRouter } from "next/navigation"
import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusOption } from "@/config/variable.config";
import Link from "next/link";
import { toast } from "sonner";

export default function VaccineSingleDetailPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const router = useRouter();

  const [vaccineSingleDetail, setVaccineSingleDetail] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-single/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setVaccineSingleDetail(data.vaccineSingleDetail);
            setStatus(data.vaccineSingleDetail.status);
          }
        })
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      dosage: e.target.dosage.value,
      price: e.target.price.value,
      status: status,
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-single/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => {return data});

    toast.promise(promise, {
      loading: "Updating vaccine single...",
      success: (data) => {
        router.push('/work/manage/vaccine-single');
        return data.message;
      },
      error: (err) => err.message,
    })
  }

  return (
    <>
      <SectionHeader title={`Vaccine Single Detail - ${vaccineSingleDetail?.pet_name} - ${formatDate(vaccineSingleDetail?.date)}`} />
      <div className="bg-white border border-gray-100 shadow-xl p-5 rounded-md mt-5">
        <form className="" onSubmit={handleSubmit}>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="dosage" className="text-sm font-medium text-[var(--main)]">Dosage</Label>
                <Input
                  type="text"
                  id="dosage"
                  name="dosage"
                  defaultValue={vaccineSingleDetail?.dosage}
                />
              </div>
            </div>
            <div className="w-full">
              
            </div>
          </div>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="price" className="text-sm font-medium text-[var(--main)]">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={vaccineSingleDetail?.price}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="status" className="text-sm font-medium text-[var(--main)]">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOption.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button className={"w-full bg-[var(--main)] hover:bg-[var(--main-hover)]"}>Save</Button>
        </form>
        <Link href="/work/manage/vaccine-single" className="hover:underline mt-5 text-[var(--main)] flex justify-center">Back</Link>
      </div>
    </>
  )
}