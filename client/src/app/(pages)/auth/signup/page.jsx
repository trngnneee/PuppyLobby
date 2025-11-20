"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function SiginPage() {  
  return (
    <>
      <div className="font-bold text-[36px] text-[var(--main)]">Sign Up</div>
      <div className="text-gray-400 mb-5">Enter your full name, email, and password to sign up</div>
      <form id="adminRegisterFrom">
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
        <div id="agreeContainer" className="mb-[33px]"></div>
        <Button className="w-full bg-[var(--main)] hover:bg-[var(--main-hover)]">Sign In</Button>
      </form>
      <div className="mt-[26px] text-[var(--main)] text-center">Already have an account? <Link className="font-bold hover:underline" href="/auth/signin">Sign In</Link></div>
    </>
  )
}