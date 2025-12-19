"use client"

import { ProductItem } from "@/app/(pages)/components/ProductItem"
import { SearchBar } from "@/app/(pages)/components/SearchBar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SectionSubHeader } from "./components/SectionSubHeader";
import { MedicineTable } from "./components/MedicineTable";
import { FoodTable } from "./components/FoodTable";
import { AccessoryTable } from "./components/AccessoryTable";
import { useState } from "react";

export default function ProductShowcase() {
    const [keyword, setKeyword] =  useState("");
    const [submitKeyword, setSubmitKeyword] = useState("");

    return (
        <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
                Premium Pet Products
            </h1>
            <p className="text-xl text-gray-600">
                Treat your beloved companion with quality food and jewelry
            </p>
            </div>

            <div className="mt-[20px]">
            <SearchBar keyword={keyword} setKeyword={setKeyword} setSubmitKeyword = {setSubmitKeyword}/>
            </div>
            <Tabs className="w-full mt-[30px]" defaultValue="tab-1">

            <TabsList className="h-auto rounded-none bg-transparent p-0 flex justify-center w-full">
                <div onClick={() => {setKeyword(""); setSubmitKeyword("") ;}}>
                    <TabsTrigger 
                    className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
                    value="tab-1"
                    >
                    Medicine
                    </TabsTrigger>
                </div>
                
                <TabsTrigger onClick={() => {setKeyword(""); setSubmitKeyword("");}}
                className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
                value="tab-2"
                >
                Food
                </TabsTrigger>
                <TabsTrigger onClick={() => {setKeyword(""); setSubmitKeyword("");}}
                className="relative rounded-none py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary text-lg"
                value="tab-3"
                >
                Accessory
                </TabsTrigger>
            </TabsList>
            <TabsContent value="tab-1">
                <div>
                <MedicineTable searchKey = {submitKeyword} />
                </div>
            </TabsContent>
            <TabsContent value="tab-2">
                <div>
                <FoodTable  searchKey = {submitKeyword}/>
                </div>
            </TabsContent>
            <TabsContent value="tab-3">
                <div>
                <AccessoryTable searchKey = {submitKeyword}/>
                </div>
            </TabsContent>
            </Tabs>
        </div>
        </div>
    );
    }