"use client"

import { SearchBar } from "@/app/(pages)/components/SearchBar";
import { SectionHeader } from "../../../me/components/SectionHeader";
import { EmployeeTable } from "./components/EmployeeTable";
import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { useState } from "react";

export default function EmployeeManagePage() {
  const [keyword, setKeyword] = useState("")
  const [submitKeyword, setSubmitKeyword] = useState("")
  
  return (
    <>
      <SectionHeader title={"Employee Management"} />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <CreateButton
          title={"Add new Employee"}
          link={"/employee/manage/create"}
        />
        <SearchBar keyword={keyword} setKeyword={setKeyword} setSubmitKeyword={setSubmitKeyword} />
      </div>
      <EmployeeTable keyword={submitKeyword} />
    </>
  )
}