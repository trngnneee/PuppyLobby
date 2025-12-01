"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JustValidate from "just-validate";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiginPage() {
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const validation = new JustValidate('#adminRegisterFrom');
    validation.addField('#fullname', [
      {
        rule: 'required',
        errorMessage: 'Full name is required',
      },
      {
        rule: 'minLength',
        value: 3,
      },
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
      .addField('#username', [
        {
          rule: 'required',
          errorMessage: 'Username is required',
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
      .addField('#agree', [
        {
          rule: 'required',
          errorMessage: 'You must agree to the terms and conditions',
        },
      ], {
        errorsContainer: '#agreeContainerError',
      })
      .onSuccess((event) => {
        setSubmit(true);
      });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const fullname = e.target.fullname.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      console.log({ fullname, email, password });
    }
  }

  return (
    <>
      <div className="font-bold text-[36px] text-[var(--main)]">Sign Up</div>
      <div className="text-gray-400 mb-5">Enter your full name, email, and password to sign up</div>
      <form id="adminRegisterFrom" onSubmit={handleSubmit}>
        <div className="mb-[15px] *:not-first:mt-2">
          <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)] ">Full Name*</Label>
          <Input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="John Doe"
          />
        </div>
        <div className="mb-[15px] *:not-first:mt-2">
          <Label htmlFor="username" className="text-sm font-medium text-[var(--main)] ">Username*</Label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="johndoe"
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
        <div className="flex items-center gap-[11px] mb-[5px]">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            className="w-4 h-4 accent-[var(--main)]"
          />
          <Label htmlFor="agree" className="text-sm text-[var(--main)]">
            Agree to the terms and conditions
          </Label>
        </div>
        <div id="agreeContainerError" className="mb-[33px]"></div>
        <Button disabled={submit} className="w-full bg-[var(--main)] hover:bg-[var(--main-hover)]">Sign In</Button>
      </form>
      <div className="mt-[26px] text-[var(--main)] text-center">Already have an account? <Link className="font-bold hover:underline" href="/me/auth/signin">Sign In</Link></div>
    </>
  )
}