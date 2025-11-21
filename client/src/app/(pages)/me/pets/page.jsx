"use client"

import { Button } from "@/components/ui/button";
import { SectionHeader } from "../components/SectionHeader";
import { PetsTable } from "./components/PetsTable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MePetsPage(){
  const router = useRouter();
  
  return (
    <>
      <SectionHeader title="Pet Management" />
      <div className="mt-[30px]">
        <Button onClick={() => router.push("/me/pets/create")} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white flex items-center">
          <span>Add new pet</span>
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <PetsTable />
    </>
  )
}