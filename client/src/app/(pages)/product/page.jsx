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

    const products = [
        {
        id: 1,
        name: "Premium Dog Food",
        desc: "Nutritious meal for healthy dogs",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
        price: 24.99
        },
        {
        id: 2,
        name: "Dog Treat Pack",
        desc: "Delicious and healthy treats",
        image: "https://images.unsplash.com/photo-1568152950566-c1bf43f0a86d?w=300&h=300&fit=crop",
        price: 12.99
        },
        {
        id: 3,
        name: "Diamond Collar",
        desc: "Luxurious pet jewelry",
        image: "https://images.unsplash.com/photo-1570129477492-45ac003b2020?w=300&h=300&fit=crop",
        price: 45.99
        },
        {
        id: 4,
        name: "Organic Dog Treats",
        desc: "Natural ingredients, no additives",
        image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=300&fit=crop",
        price: 18.99
        },
        {
        id: 5,
        name: "Gold Pet Necklace",
        desc: "Elegant accessory for your pet",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
        price: 89.99
        },
        {
        id: 6,
        name: "Grain-Free Kibble",
        desc: "Premium quality food blend",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f0?w=300&h=300&fit=crop",
        price: 32.99
        }
    ];

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