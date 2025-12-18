"use client"
import { useState } from "react";
import { CreateButton } from "@/app/(pages)/components/CreateButton";
import { SectionHeader } from "../../../me/components/SectionHeader";
import { MedicineTable } from "./components/MedicineTable";
import { SectionSubHeader } from "./components/SectionSubHeader";
import { SearchBar } from "@/app/(pages)/components/SearchBar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FoodTable } from "./components/FoodTable";
import { AccessoryTable } from "./components/AccessoryTable";

export default function AdminProductPage() {

  const [keyword, setKeyword] =  useState("");
  const [submitKeyword, setSubmitKeyword] = useState("");
  return (
    <>
      <SectionHeader title={"Product Management"} />
      <div className="mt-[30px] flex items-center gap-[30px]">
        <CreateButton
          title={"Add new Product"}
          link={"/product/manage/create"}
        />
      </div>
      <div className="mt-[20px]">
        <SearchBar keyword={keyword} setKeyword={setKeyword} setSubmitKeyword = {setSubmitKeyword}/>
      </div>
      <Tabs className="w-full mt-[30px]" defaultValue="tab-1">

        <TabsList className="h-auto rounded-none bg-transparent p-0 flex justify-center w-full">
          <div onClick={() => {setKeyword(""); setSubmitKeyword("")}}>
             <TabsTrigger 
                className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
                value="tab-1"
              >
                Medicine
              </TabsTrigger>
          </div>
         
          <TabsTrigger onClick={() => {setKeyword(""); setSubmitKeyword("")}}
            className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
            value="tab-2"
          >
            Food
          </TabsTrigger>
          <TabsTrigger onClick={() => {setKeyword(""); setSubmitKeyword("")}}
            className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
            value="tab-3"
          >
            Accessory
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <div>
            <SectionSubHeader title={"Medicine List"} />
            <MedicineTable searchKey = {submitKeyword} />
          </div>
        </TabsContent>
        <TabsContent value="tab-2">
          <div>
            <SectionSubHeader title={"Food List"} />
            <FoodTable  searchKey = {submitKeyword}/>
          </div>
        </TabsContent>
        <TabsContent value="tab-3">
          <div>
            <SectionSubHeader title={"Accessory List"} />
            <AccessoryTable searchKey = {submitKeyword}/>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}