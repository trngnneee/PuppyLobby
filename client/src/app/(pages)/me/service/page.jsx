import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "../components/SectionHeader";
import { MedicalExam } from "./components/MedicalExam";
import { VaccinationSingleService } from "./components/VaccinationSingleService";
import { VaccinationPackageService } from "./components/VaccinationPackageService";

export default function MeAppointmentsPage() {
  return (
    <>
      <SectionHeader title="Your Services" />
      <div className="mt-5">
        <Tabs defaultValue="medical-examination" className="items-center">
          <TabsList className="h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
            <TabsTrigger
              value="medical-examination"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Medical Examination
            </TabsTrigger>
            <TabsTrigger
              value="vaccination-single-service"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Vaccination Single Service
            </TabsTrigger>
            <TabsTrigger
              value="vaccination-package-service"
              className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
            >
              Vaccination Package Service
            </TabsTrigger>
          </TabsList>
          <TabsContent value="medical-examination" className="w-full border border-gray-300 rounded-[20px] p-5">
            <MedicalExam />
          </TabsContent>
          <TabsContent value="vaccination-single-service" className="w-full">
            <VaccinationSingleService />
          </TabsContent>
          <TabsContent value="vaccination-package-service" className="w-full">
            <VaccinationPackageService />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}