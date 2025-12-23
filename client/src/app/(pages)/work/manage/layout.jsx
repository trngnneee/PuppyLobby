"use client"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/provider/auth.provider"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ManageWorkLayout({ children }) {
  const { userInfo } = useAuth();

  const tabs = (userInfo?.is_veterinarian ? [
    { label: "Medical Exam", href: "/work/manage/medical-exam" },
    { label: "Vaccine Single Service", href: "/work/manage/vaccine-single" },
    { label: "Vaccine Package Service", href: "/work/manage/vaccine-package" },
  ] : [
    { label: "Onsite Service", href: "/work/manage/onsite-service" },
  ])
  const pathname = usePathname()

  return (
    <>
      <AuthProvider>
        <div className="container mx-auto my-10">
          <div className="text-[36px] font-bold text-[var(--main)]">Manage Work Page</div>
          <div className="flex gap-2 border-b mb-6 justify-center">
            {tabs.map(tab => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== "/manage-work" && pathname.startsWith(tab.href))

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "px-4 py-2 font-medium transition",
                    isActive
                      ? "border-b-2 border-[var(--main)] text-[var(--main)]"
                      : "text-muted-foreground hover:text-[var(--main)]"
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
          {children}
        </div>
      </AuthProvider>
    </>
  )
}