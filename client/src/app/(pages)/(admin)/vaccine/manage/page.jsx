"use client"

import { CreateButton } from "@/app/(pages)/components/CreateButton"
import { SearchBar } from "@/app/(pages)/components/SearchBar"
import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader"
import { useState } from "react"
import { VaccineTable } from "./components/VaccineTable"

export default function VaccinePage() {
  const [keyword, setKeyword] = useState("")
  
  return (
    <>
      <SectionHeader title={"Vaccine Management"} />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <CreateButton
          title={"Add new vaccine"}
          link={"/vaccine/manage/create"}
        />
        <SearchBar keyword={keyword} setKeyword={setKeyword} />
      </div>
      <VaccineTable />
    </>
  )
}