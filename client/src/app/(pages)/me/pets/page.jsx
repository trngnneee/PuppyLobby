"use client"

import { SearchBar } from "@/app/(pages)/components/SearchBar";
import { SectionHeader } from "../components/SectionHeader";
import { PetsTable } from "./components/PetsTable";
import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { useState } from "react";

export default function MePetsPage(){
  const [keyword, setKeyword] = useState("");
  
  return (
    <>
      <SectionHeader title="Pet Management" />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <CreateButton
          title={"Add new pet"}
          link={"/me/pets/create"}
        />
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
        />
      </div>
      <PetsTable />
    </>
  )
}