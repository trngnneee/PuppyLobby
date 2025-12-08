"use client"

import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { SectionHeader } from "../../../me/components/SectionHeader";
import { MedicineTable } from "./components/MedicineTable";
import { SectionSubHeader } from "./components/SectionSubHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FoodTable } from "./components/FoodTable";
import { AccessoryTable } from "./components/AccessoryTable";

export default function AdminProductPage() {
  return (
    <>
      <SectionHeader title={"Product Management"} />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <CreateButton
          title={"Add new Product"}
          link={"/product/manage/create"}
        />
      </div>
      <Tabs className="w-full mt-[30px]" defaultValue="tab-1">
        <TabsList className="h-auto rounded-none bg-transparent p-0 flex justify-center w-full">
          <TabsTrigger
            className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
            value="tab-1"
          >
            Medicine
          </TabsTrigger>
          <TabsTrigger
            className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
            value="tab-2"
          >
            Food
          </TabsTrigger>
          <TabsTrigger
            className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
            value="tab-3"
          >
            Accessory
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <div>
            <SectionSubHeader title={"Medicine List"} />
            <MedicineTable />
          </div>
        </TabsContent>
        <TabsContent value="tab-2">
          <div>
            <SectionSubHeader title={"Food List"} />
            <FoodTable />
          </div>
        </TabsContent>
        <TabsContent value="tab-3">
          <div>
            <SectionSubHeader title={"Accessory List"} />
            <AccessoryTable />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}