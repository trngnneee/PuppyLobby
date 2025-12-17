"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { formatDate } from "@/utils/date";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { statusOption } from "@/config/variable.config";
import { toast } from "sonner";

export default function VaccinePackagePage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const router = useRouter();

  const [vaccinePackageDetail, setVaccinePackageDetail] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-package/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setVaccinePackageDetail(data.vaccinePackageDetail);
            setStatus(data.vaccinePackageDetail.status);
          }
        })
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      price: e.target.price.value,
      status: status,
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-package/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => { return data });

    toast.promise(promise, {
      loading: "Updating vaccine package...",
      success: (data) => {
        router.push('/work/manage/vaccine-package');
        return data.message;
      },
      error: (err) => err.message,
    })
  }

  return (
    <>
      <SectionHeader title={`Vaccine Package Detail - ${vaccinePackageDetail?.pet_name} - ${formatDate(vaccinePackageDetail?.date)}`} />
      <div className="bg-white border border-gray-100 shadow-xl p-5 rounded-md mt-5">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="packageName" className="text-sm font-medium text-[var(--main)]">Package name</Label>
                <Input
                  type="text"
                  id="packageName"
                  name="packageName"
                  defaultValue={vaccinePackageDetail?.package_name}
                  readOnly
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="start-date" className="text-sm font-medium text-[var(--main)]">Start date</Label>
                <Input
                  type="text"
                  id="start-date"
                  name="start-date"
                  defaultValue={formatDate(vaccinePackageDetail?.start_date)}
                  readOnly
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="end-date" className="text-sm font-medium text-[var(--main)]">End date</Label>
                <Input
                  type="text"
                  id="end-date"
                  name="end-date"
                  defaultValue={formatDate(vaccinePackageDetail?.end_date)}
                  readOnly
                />
              </div>
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
                  defaultValue={vaccinePackageDetail?.price}
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
      </div>
    </>
  )
}