"use client"

import { usePathname, useRouter } from "next/navigation";
import { EmployeeSider } from "./components/EmployeeSider";
import { useEffect } from "react";
import { EmployeeProvider, useEmployeeAuthContext } from "@/provider/employee.provider";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();

  if (pathname.includes("/employee/auth")) {
    return (
      <>{children}</>
    )
  }

  const { userInfo } = useEmployeeAuth();
  const router = useRouter();
  useEffect(() => {
    if (userInfo === null || userInfo === undefined) return;

    if (userInfo.is_manager === false) {
      router.push("/");
    }
  }, [userInfo, router]);

  if (!userInfo || (userInfo && userInfo.is_manager === false)) {
    return <></>;
  }

  return (
    <EmployeeProvider>
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
    </EmployeeProvider>
  )
}