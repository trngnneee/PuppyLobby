import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { ServiceTable } from "./components/ServiceTable";

export default function AdminServicePage() {
  
  return (
    <>
      <SectionHeader title={"Service Management"} />
      <ServiceTable />
    </>
  )
}