"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function SiginPage() {
  return (
    <>
      <div className="font-bold text-[36px] text-[var(--main)]">Sign In</div>
      <div className="text-gray-400 mb-5">Enter your email, and password to sign in</div>
      <form id="adminRegisterFrom">
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
          <Link href="/auth/forgot-password" className="text-sm text-[var(--main)] font-medium hover:underline">Forgot password?</Link>
        </div>
        <div id="agreeContainer" className="mb-[33px]"></div>
        <Button className="w-full bg-[var(--main)] hover:bg-[var(--main-hover)]">Sign In</Button>
      </form>
      <div className="mt-[26px] text-[var(--main)] text-center">Don't have an account? <Link className="font-bold hover:underline" href="/auth/signup">Sign Up</Link></div>
    </>
  )
}