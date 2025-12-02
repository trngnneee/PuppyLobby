"use client"

import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { SearchBar } from "@/app/(pages)/components/SearchBar";
import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { useState } from "react";
import { ServiceTable } from "./components/ServiceTable";

export default function AdminServicePage() {
  const [keyword, setKeyword] = useState("");
  
  return (
    <>
      <SectionHeader title={"Service Management"} />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <SearchBar keyword={keyword} setKeyword={setKeyword} />
      </div>
      <ServiceTable />
    </>
  )
}