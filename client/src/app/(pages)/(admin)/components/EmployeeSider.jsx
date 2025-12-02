"use client"

import { cn } from "@/lib/utils"
import { Grid2X2, HeartHandshake, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const EmployeeSider = () => {
  const pathName = usePathname();
  const siderData = [
    {
      title: "Employee Dashboard",
      href: "/employee/manage",
      icon: User
    },
    {
      title: "Product Dashboard",
      href: "/product/manage",
      icon: Grid2X2
    },
    {
      title: "Service Dashboard",
      href: "/service/manage",
      icon: HeartHandshake
    },
  ]
  
  return (
    <div className="rounded-[20px] shadow-2xl gap-5 border border-gray-200 p-5 sticky top-20 self-start">
      <div className="flex flex-col gap-3 top-20">
        {siderData.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-lg hover:bg-[var(--main)] hover:text-white transition-colors",
              pathName === item.href ? "bg-[var(--main)] font-medium text-white" : "font-normal"
            )}
          >
            <item.icon />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}