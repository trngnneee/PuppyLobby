"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, formatDateReverse } from "@/utils/date";
import JustValidate from "just-validate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VaccineUpdatePage() {
  const [submit, setSubmit] = useState(false);
  const [manufactureDate, setManufactureDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const validation = new JustValidate('#vaccineCreateForm');

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Name is required',
        },
        {
          rule: 'maxLength',
          value: 100,
          errorMessage: 'Name cannot exceed 100 characters',
        },
      ])
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Price is required',
        },
        {
          rule: 'number',
          errorMessage: 'Price must be a number',
        },
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Price must be at least 0',
        },
      ])
      .addField('#quantity', [
        {
          rule: 'required',
          errorMessage: 'Quantity is required',
        },
        {
          rule: 'number',
          errorMessage: 'Quantity must be a number',
        },
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Quantity must be at least 0',
        },
      ]).onSuccess(() => {
        setSubmit(true);
      });
  }, [])

  const [vaccineDetail, setVaccineDetail] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/detail/${id}`)
        .then(res => res.json())
        .then((data) => {
          if (data.code === "success") {
            setVaccineDetail(data.vaccineDetail);
            setManufactureDate(new Date(data.vaccineDetail.manufacture_date));
            setEntryDate(new Date(data.vaccineDetail.entry_date));
            setExpireDate(new Date(data.vaccineDetail.expiry_date));
          }
        })
    }
    fetchData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submit) {
      const finalData = {
        vaccine_name: e.target.name.value,
        price: parseFloat(e.target.price.value),
        manufacture_date: formatDateReverse(manufactureDate),
        entry_date: formatDateReverse(entryDate),
        expiry_date: formatDateReverse(expireDate),
        quantity: parseInt(e.target.quantity.value),
      };

      const promise = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });

      toast.promise(promise, {
        loading: 'Updating vaccine...',
        success: (data) => {
          if (data.code == "success") {
            setTimeout(() => {
              router.push('/vaccine/manage')
            }, 1000);
            return data.message;
          }
          else return Promise.reject(data.message);
        },
        error: (err) => `Error: ${err}`,
      })
    }
  }

  return (
    <>
      <SectionHeader title={`Update Vaccine ${vaccineDetail?.vaccine_name || ''}`} />
      <form className="mt-[30px]" id="vaccineCreateForm" onSubmit={handleSubmit}>
        <div className="">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="name" className="text-sm font-medium text-[var(--main)]">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={vaccineDetail?.vaccine_name || ''}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="price" className="text-sm font-medium text-[var(--main)]">Price</Label>
                <Input
                  type="number"
                  min="0"
                  id="price"
                  name="price"
                  defaultValue={vaccineDetail?.price || ''}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="manufacture_date" className="text-sm font-medium text-[var(--main)]">Manufacture date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="manufacture_date"
                      name="manufacture_date"
                      value={formatDate(manufactureDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={manufactureDate}
                      onSelect={setManufactureDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="entry_date" className="text-sm font-medium text-[var(--main)]">Entry date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="entry_date"
                      name="entry_date"
                      value={formatDate(entryDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={entryDate}
                      onSelect={setEntryDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="expire_date" className="text-sm font-medium text-[var(--main)]">Expire date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="expire_date"
                      name="expire_date"
                      value={formatDate(expireDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={expireDate}
                      onSelect={setExpireDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-[var(--main)]">Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  id="quantity"
                  name="quantity"
                  defaultValue={vaccineDetail?.quantity || ''}
                />
              </div>
            </div>
          </div>
        </div>
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}