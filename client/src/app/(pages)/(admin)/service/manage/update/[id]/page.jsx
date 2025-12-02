"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";

export default function ServiceUpdatePage() {
  const [submit, setSubmit] = useState(false);
  const [branch, setBranch] = useState("1");

  useEffect(() => {
    const validation = new JustValidate('#serviceCreateForm');
    validation
      .addField('#name', [
        { rule: 'required', errorMessage: 'Name is required' },
        { rule: 'minLength', value: 3, errorMessage: 'Name must be at least 3 characters' },
        { rule: 'maxLength', value: 50, errorMessage: 'Name must be at most 50 characters' },
      ]);
    validation.onSuccess(() => {
      setSubmit(true);
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const name = e.target.name.value;
      console.log({ name, branch });
    }
  }

  return (
    <>
      <SectionHeader title="Add new Service" />
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
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="branch" className="text-sm font-medium text-[var(--main)]">Branch</Label>
                <Select defaultValue={branch} onValueChange={setBranch}>
                  <SelectTrigger id="productType">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Branch 1</SelectItem>
                    <SelectItem value="2">Branch 2</SelectItem>
                    <SelectItem value="3">Branch 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}