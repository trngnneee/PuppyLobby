"use client"

import { usePathname } from "next/navigation";
import { Sider } from "./components/Sider";
import { AuthProvider } from "@/provider/auth.provider";

export default function MeLayout({ children }) {
  const pathname = usePathname();

  if (pathname.includes("/me/auth")) {
    return (
      <>{children}</>
    )
  }

  return (
    <AuthProvider>
      <div className="flex gap-5 container mx-auto justify-start mb-10">
        <Sider />
        <div className="flex-1">
          <div className="mx-auto container rounded-[20px] shadow-2xl gap-5 border border-gray-200">
            <div className="px-10 py-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}