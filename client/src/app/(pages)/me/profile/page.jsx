"use client"

import { Label } from "@/components/ui/label";
import { SectionHeader } from "../components/SectionHeader";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import JustValidate from "just-validate";
import { useAuthContext } from "@/provider/auth.provider";
import { toast } from "sonner";

export default function MeProfilePage() {
  const [submit, setSubmit] = useState(false);
  const { userInfo } = useAuthContext();

  useEffect(() => {
    const validation = new JustValidate("#profile-form");
    validation
      .addField("#customer_name", [
        {
          rule: "required",
          errorMessage: "Full name is required",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Full name must be at least 3 characters",
        }
      ])
      .addField("#phone_number", [
        {
          rule: "required",
          errorMessage: "Phone is required",
        },
        {
          rule: 'customRegexp',
          value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          errorMessage: 'Phone number is not valid',
        }
      ])
      .addField("#cccd", [
        {
          rule: "required",
          errorMessage: "Citizen ID is required",
        },
        {
          rule: "minLength",
          value: 9,
          errorMessage: "Citizen ID must be at least 9 characters",
        }
      ])
      .onSuccess(() => {
        setSubmit(true);
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const finalData = {
        customer_name: e.target.customer_name.value,
        phone_number: e.target.phone_number.value,
        cccd: e.target.cccd.value,
      }
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/profile/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
      toast.promise(promise, {
        loading: 'Updating profile...',
        success: (data) => {
          if (data.code == "success") {
            window.location.reload();
            return data.message;
          }
        },
        error: (data) => data.message,
      });
      setSubmit(false);
    }
  }

  return (
    <>
      <SectionHeader title="Profile" />
      <form onSubmit={handleSubmit} className="" id="profile-form">
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="customer_name" className="text-sm font-medium text-[var(--main)]">Full name</Label>
                <Input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  defaultValue={userInfo?.customer_name}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="username" className="text-sm font-medium text-[var(--main)]">Username</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  readOnly
                  defaultValue={userInfo?.username}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="email" className="text-sm font-medium text-[var(--main)]">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  readOnly
                  defaultValue={userInfo?.email}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="phone_number" className="text-sm font-medium text-[var(--main)]">Phone number</Label>
                <Input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  defaultValue={userInfo?.phone_number}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="cccd" className="text-sm font-medium text-[var(--main)]">Citizen ID</Label>
                <Input
                  type="text"
                  id="cccd"
                  name="cccd"
                  defaultValue={userInfo?.cccd}
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