"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export const CreateButton = ({ title, link }) => {
  const router = useRouter();
  
  return (
    <>
      <Button onClick={() => router.push(link)} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white flex items-center">
        <span>{title}</span>
        <Plus className="ml-2 h-4 w-4" />
      </Button>
    </>
  )
}