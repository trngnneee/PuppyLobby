"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JustValidate from "just-validate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SiginPage() {
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const validation = new JustValidate('#adminRegisterFrom');
    validation
      .addField('#username', [
        {
          rule: 'required',
          errorMessage: 'Username is required',
        },
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Username must be at least 3 characters long!',
        }
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Email is required',
        },
        {
          rule: 'email',
          errorMessage: 'Email is invalid!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Please enter your password!',
        },
        {
          validator: (value) => value.length >= 8,
          errorMessage: 'Password must be at least 8 characters long!',
        },
        {
          validator: (value) => /[A-Z]/.test(value),
          errorMessage: 'Password must contain at least one uppercase letter!',
        },
        {
          validator: (value) => /[a-z]/.test(value),
          errorMessage: 'Password must contain at least one lowercase letter!',
        },
        {
          validator: (value) => /\d/.test(value),
          errorMessage: 'Password must contain at least one digit!',
        },
        {
          validator: (value) => /[@$!%*?&]/.test(value),
          errorMessage: 'Password must contain at least one special character!',
        },
      ])
      .onSuccess(() => {
        setSubmit(true);
      });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const username = e.target.username.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const rememberLogin = e.target.rememberLogin.checked;

      const finalData = {
        username,
        email,
        password,
        rememberLogin
      };

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })

      toast.promise(promise, {
        loading: 'Signing in...',
        success: (data) => {
          if (data.code === 'success') {
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
          return data.message;
        },
        error: (data) => data.message
      })
    }
    setSubmit(false);
  }

  return (
    <>
      <div className="font-bold text-[36px] text-[var(--main)]">Sign In</div>
      <div className="text-gray-400 mb-5">Enter your email, and password to sign in</div>
      <form id="adminRegisterFrom" onSubmit={handleSubmit}>
        <div className="mb-[15px] *:not-first:mt-2">
          <Label htmlFor="username" className="text-sm font-medium text-[var(--main)] ">Username*</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="exampleuser"
          />
        </div>
        <div className="mb-[15px] *:not-first:mt-2">
          <Label htmlFor="email" className="text-sm font-medium text-[var(--main)] ">Email*</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="mb-[15px] *:not-first:mt-2">
          <Label htmlFor="password" className="text-sm font-medium text-[var(--main)]">Password*</Label>
          <Input
            type="password"
            id="password"
            name="password"
          />
        </div>
        <div className="flex justify-between items-center mb-[33px]">
          <div className="flex items-center gap-[11px]">
            <input
              type="checkbox"
              id="rememberLogin"
              name="rememberLogin"
              className="w-4 h-4 accent-[#2B3674]"
            />
            <Label htmlFor="rememberLogin" name="rememberLogin" className="text-sm text-[var(--main)]">Remember me</Label>
          </div>
          {/* <Link href="/auth/forgot-password" className="text-sm text-[var(--main)] font-medium hover:underline">Forgot password?</Link> */}
        </div>
        <div id="agreeContainer" className="mb-[33px]"></div>
        <Button disabled={submit} className="w-full bg-[var(--main)] hover:bg-[var(--main-hover)]">Sign In</Button>
      </form>
      <div className="mt-[26px] text-[var(--main)] text-center">Don't have an account? <Link className="font-bold hover:underline" href="/me/auth/signup">Sign Up</Link></div>
    </>
  )
}