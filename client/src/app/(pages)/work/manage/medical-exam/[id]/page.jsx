"use client"

import { useParams, useRouter } from "next/navigation"
import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, formatDateReverse } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { statusOption } from "@/config/variable.config";
import Link from "next/link";
import { toast } from "sonner";
import { paramsBuilder } from "@/utils/params";
import { RadioGroup } from "@/components/ui/radio-group";
import { MedicineItem } from "./components/MedicineItem";
import { MedicineItemSkeleton } from "./components/MedicineItemSkeleton";
import PaginationComponent from "@/components/common/Pagination";
import { ArrowRightIcon, SearchIcon } from "lucide-react";

export default function MedicalExamDetailPage() {
  const { id } = useParams();
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState("");
  const [prescription, setPrescription] = useState([]);
  const router = useRouter();

  const [medicalExamDetail, setMedicalExamDetail] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setMedicalExamDetail(data.medicalExamDetail);
            setStatus(data.medicalExamDetail.status);
            setDate(data.medicalExamDetail.next_appointment);
          }
        })
    };
    fetchData();
  }, []);

  const [medicineList, setMedicineList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/product/product_types`, {
        type: "medicine",
        page: currentPage,
        pageSize: 9,
        search: keyword,
      })
      await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setMedicineList(data.productList);
            setTotalPages(data.totalPages);
          }
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentPage, keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      symptom: e.target.symptom.value,
      diagnosis: e.target.diagnosis.value,
      prescription: prescription
        .map(p => `${p.product_name} - ${p.dosage}mg`)
        .join("\n"),
      price: e.target.price.value,
      next_appointment: formatDateReverse(date),
      status: status,
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => { return data });

    toast.promise(promise, {
      loading: "Updating medical exam...",
      success: (data) => {
        router.push('/work/manage/medical-exam');
        return data.message;
      },
      error: (err) => err.message,
    })
  }

  return (
    <>
      <SectionHeader title={`Medical Exam Detail - ${medicalExamDetail?.pet_name} - ${formatDate(medicalExamDetail?.date)}`} />
      <div className="bg-white border border-gray-100 shadow-xl p-5 rounded-md mt-5">
        <form className="" onSubmit={handleSubmit}>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="symptom" className="text-sm font-medium text-[var(--main)]">Symptom</Label>
                <Textarea
                  type="text"
                  id="symptom"
                  name="symptom"
                  defaultValue={medicalExamDetail?.symptom}
                />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="diagnosis" className="text-sm font-medium text-[var(--main)]">Diagnosis</Label>
              <Textarea
                type="text"
                id="diagnosis"
                name="diagnosis"
                defaultValue={medicalExamDetail?.diagnosis}
              />
            </div>
          </div>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="prescription" className="text-sm font-medium text-[var(--main)]">Prescription</Label>
                <Textarea
                  type="text"
                  id="prescription"
                  name="prescription"
                  defaultValue={medicalExamDetail?.prescription}
                  readOnly
                  value={prescription
                    .map(p => `${p.product_name} - ${p.dosage}mg`)
                    .join("\n")
                  }
                  onChange={() => { }}
                  rows={10}
                />
              </div>
            </div>
          </div>
          <div className="mb-10">
            <div className="w-1/2">
              <div className="relative">
                <Input
                  className="peer ps-9 pe-9"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search..."
                  type="search"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <button
                  aria-label="Submit search"
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  <ArrowRightIcon aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-3 my-5"
            >
              {medicineList.length > 0 ? medicineList.map((item) => (
                <MedicineItem
                  key={item.product_info.product_id}
                  item={item}
                  prescription={prescription}
                  setPrescription={setPrescription}
                />
              )) : (
                [...Array(3)].map((_, index) => (
                  <MedicineItemSkeleton key={index} />
                ))
              )}
            </div>
            <PaginationComponent
              numberOfPages={totalPages}
              currentPage={currentPage}
              controlPage={(value) => setCurrentPage(value)}
            />
          </div>
          <div className="flex gap-[30px]">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="price" className="text-sm font-medium text-[var(--main)]">Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={medicalExamDetail?.price}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="diagnosis" className="text-sm font-medium text-[var(--main)]">Next Appointment</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formatDate(date)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      onChange={setDate}
                      value={date}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
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
        <Link href="/work/manage/medical-exam" className="hover:underline mt-5 text-[var(--main)] flex justify-center">Back</Link>
      </div>
    </>
  )
}