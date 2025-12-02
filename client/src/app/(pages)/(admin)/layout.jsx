"use client"

import { usePathname } from "next/navigation";
import { EmployeeSider } from "./components/EmployeeSider";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();

  if (pathname.includes("/employee/auth")) {
    return (
      <>{children}</>
    )
  }
  
  return (
    <div className="flex gap-5 container mx-auto justify-start mb-10">
      <EmployeeSider />
      <div className="flex-1">
        <div className="mx-auto container rounded-[20px] shadow-2xl gap-5 border border-gray-200">
          <div className="px-10 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}