"use client"

import { usePathname, useRouter } from "next/navigation";
import { EmployeeSider } from "./components/EmployeeSider";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/provider/auth.provider";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userInfo === null || userInfo === undefined) return;

    if (userInfo.is_manager === false) {
      router.push("/");
    }
  }, [userInfo, router]);

  if (pathname.includes("/employee/auth")) {
    return (
      <>{children}</>
    )
  }

  if (!userInfo || (userInfo && userInfo.is_manager === false)) {
    return <div className="container mx-auto">Loading...</div>;
  }

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}