"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { ScheduleBox } from "./components/ScheduleBox";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VaccinePackageCreatePage() {
  const router = useRouter();
  const [submit, setSubmit] = useState(false);
  const [scheduleIndex, setScheduleIndex] = useState(1);
  const [schedule, setSchedule] = useState([]);
 
  const handleScheduleChange = (data, index) => {
    const newSchedule = [...schedule];
    newSchedule[index] = data;
    setSchedule(newSchedule);
  }

  const handleDeleteSchedule = (index) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(newSchedule);
    setScheduleIndex(scheduleIndex - 1);
  }

  useEffect(() => {
    const validation = new JustValidate('#vaccineCreateForm');

    validation
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Name is required',
        },
        {
          rule: 'minLength',
          value: 2,
          errorMessage: 'Name must be at least 2 characters',
        },
        {
          rule: 'maxLength',
          value: 100,
          errorMessage: 'Name cannot exceed 100 characters',
        },
      ])
      .addField('#duration', [
        {
          rule: 'required',
          errorMessage: 'Duration is required',
        },
        {
          rule: 'number',
          errorMessage: 'Duration must be a number',
        },
      ])
      .addField('#discount_rate', [
        {
          rule: 'required',
          errorMessage: 'Discount rate is required',
        },
        {
          rule: 'number',
          errorMessage: 'Discount rate must be a number',
        },
      ])
      .addField('#original_price', [
        {
          rule: 'required',
          errorMessage: 'Original price is required',
        },
        {
          rule: 'number',
          errorMessage: 'Original price must be a number',
        },
      ]);
    validation.onSuccess(() => {
        setSubmit(true);
      });
  }, [])

  const [vaccineList, setVaccineList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/list`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 'success') {
            setVaccineList(data.vaccineList);
          }
        })
    };
    fetchData();
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const package_name = e.target.name.value;
      const duration = e.target.duration.value;
      const description = e.target.description.value;
      const discount_rate = e.target.discount_rate.value;
      const total_original_price = e.target.original_price.value;

      const finalData = {
        package_name,
        duration,
        description,
        discount_rate,
        total_original_price,
        schedule
      }
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/create`, {
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
        loading: 'Creating vaccine package...',
        success: (data) => {
          if (data.code == "success") {
            setTimeout(() => {
              router.push("/vaccine-package/manage");
            }, 1000);
            return 'Vaccine package created successfully!';
          }
          return data.message;
        },
        error: 'Failed to create vaccine package.',
      });
    }
  }

  return (
    <>
      <SectionHeader title="Add new Vaccine Package" />
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
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="duration" className="text-sm font-medium text-[var(--main)]">Duration (months)</Label>
                <Input
                  type="number"
                  min="0"
                  id="duration"
                  name="duration"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-[15px] *:not-first:mt-2">
            <Label htmlFor="description" className="text-sm font-medium text-[var(--main)]">Description</Label>
            <Textarea
              id="description"
              name="description"
            />
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="discount_rate" className="text-sm font-medium text-[var(--main)]">Discount rate</Label>
                <Input
                  type="number"
                  min="0"
                  id="discount_rate"
                  name="discount_rate"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="original_price" className="text-sm font-medium text-[var(--main)]">Original price</Label>
                <Input
                  type="number"
                  min="0"
                  id="original_price"
                  name="original_price"
                />
              </div>
            </div>
          </div>
        </div>
        {[...Array(scheduleIndex)].map((_, index) => (
          <ScheduleBox key={index} index={index} onChange={handleScheduleChange} onDelete={handleDeleteSchedule} vaccineList={vaccineList} />
        ))}
        <Button type="button" onClick={() => setScheduleIndex(scheduleIndex + 1)} className="mt-5 bg-[var(--main)] hover:bg-[var(--main-hover)] text-white">Add Schedule <PlusIcon/></Button>
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Create</Button>
      </form>
    </>
  )
}