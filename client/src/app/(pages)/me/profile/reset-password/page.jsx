"use client"

import { useEffect, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JustValidate from "just-validate";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [submit, setSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validation = new JustValidate('#reset-password-form');
    validation
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
          validator: (value) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
          validator: (value) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
          validator: (value) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
      ])
      .addField('#confirm-password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
          validator: (value) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
          validator: (value) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
          validator: (value) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
        {
          validator: (value, fields) => {
            const password = fields['#password'].elem.value;
            return value == password;
          },
          errorMessage: 'Mật khẩu xác nhận không khớp!',
        }
      ])
      .onSuccess(() => {
        setSubmit(true);
      })
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/profile/reset-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({password: e.target.password.value}),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });
      toast.promise(promise, {
        loading: 'Updating password...',
        success: (data) => {
          router.push('/me/profile');
          return 'Password updated successfully!';
        },
        error: (data) => data.message,
      })
    }
  };

  return (
    <>
      <SectionHeader
        title={"Reset password"}
      />
      <form onSubmit={handleSubmit} className="" id="reset-password-form">
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="password" className="text-sm font-medium text-[var(--main)]">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-[var(--main)]">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                />
              </div>
            </div>
          </div>
        </div>
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
      <Link href="/me/profile" className="text-sm text-[var(--main)] hover:underline flex justify-center mt-[30px]">Back</Link>
    </>
  )
}