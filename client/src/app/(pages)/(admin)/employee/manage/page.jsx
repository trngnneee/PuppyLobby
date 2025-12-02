"use client"

import { SearchBar } from "@/app/(pages)/components/SearchBar";
import { SectionHeader } from "../../../me/components/SectionHeader";
import { EmployeeTable } from "./components/EmployeeTable";
import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { useState } from "react";

export default function EmployeeManagePage() {
  const [keyword, setKeyword] = useState("")
  
  return (
    <div className="container mx-auto mb-[30px]">
      <div className="bg-white p-5 rounded-[20px] shadow-xl border border-gray-300">
        <SectionHeader title={"Employee Management"} />
        <div className="mt-[30px] flex items-center gap-[30px]">
          <CreateButton
            title={"Add new Employee"}
            link={"/employee/manage/create"}
          />
          <SearchBar keyword={keyword} setKeyword={setKeyword} />
        </div>
        <EmployeeTable />
      </div>
    </div>
  )
}