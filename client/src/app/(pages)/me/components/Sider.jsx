"use client"

import { cn } from "@/lib/utils"
import { Dog, Pill, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Sider = () => {
  const pathName = usePathname();
  const siderData = [
    {
      title: "Profile",
      href: "/me/profile",
      icon: User
    },
    {
      title: "Pet Management",
      href: "/me/pets",
      icon: Dog
    },
    {
      title: "Appointment Management",
      href: "/me/appointments",
      icon: Pill
    },
  ]
  
  return (
    <div className="rounded-[20px] shadow-2xl gap-5 border border-gray-200 h-screen p-5 sticky top-20 self-start">
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