"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JustValidate from "just-validate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ServiceUpdatePage() {
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const validation = new JustValidate('#serviceCreateForm');
    validation
      .addField('#name', [
        { rule: 'required', errorMessage: 'Name is required' },
        { rule: 'minLength', value: 2, errorMessage: 'Name must be at least 2 characters' },
        { rule: 'maxLength', value: 100, errorMessage: 'Name cannot exceed 100 characters' },
      ]);
    validation.onSuccess(() => {
      setSubmit(true);
    })
  }, [])

  const [serviceDetail, setServiceDetail] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setServiceDetail(data.serviceDetail);
            setSelectedBranches(data.branchList.map(b => b.branch_id));
          }
        })
    }
    const fetchBranchList = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/list`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setBranchList(data.branchList);
          }
        })
    }
    fetchData();
    fetchBranchList();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submit) {
      const finalData = {
        price: e.target.price.value,
        branches: selectedBranches,
      }
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/update/${id}`, {
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
        loading: 'Updating service...',
        success: (data) => {
          if (data.code == "success") {
            setTimeout(() => {
              router.push('/service/manage')
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
      <SectionHeader title={`Update Service ${serviceDetail ? serviceDetail.service_name : ""}`} />
      <form className="mt-[30px]" id="serviceCreateForm" onSubmit={handleSubmit}>
        <div className="">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="name" className="text-sm font-medium text-[var(--main)]">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={serviceDetail ? serviceDetail.service_name : ""}
                  readOnly
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="price" className="text-sm font-medium text-[var(--main)]">Price</Label>
                <Input
                  type="number"
                  min='0'
                  id="price"
                  name="price"
                  defaultValue={serviceDetail ? serviceDetail.service_base_price : ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-[15px] *:not-first:mt-2">
            <Label htmlFor="branch" className="text-sm font-medium text-[var(--main)]">Branch</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {branchList.length > 0 && branchList.map((item) => (
              <div key={item.branch_id} className="flex items-center gap-3">
                <Checkbox
                  id={`${item.branch_id}`}
                  className="checked:bg-[var(--main)]"
                  checked={selectedBranches.includes(item.branch_id)}
                  onCheckedChange={() => {
                    if (selectedBranches.includes(item.branch_id)) {
                      setSelectedBranches(prev => prev.filter(id => id !== item.branch_id));
                    } else {
                      setSelectedBranches(prev => [...prev, item.branch_id]);
                    }
                  }}
                />
                <Label htmlFor={`${item.branch_id}`}>{item.branch_name}</Label>
              </div>
            ))}
          </div>
        </div>
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}