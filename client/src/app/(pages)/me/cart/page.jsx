"use client"

import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { CartItem } from "./components/CartItem";
import { PriceSummary } from "./components/PriceSummary";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function MeCartPage() {
  const cartList = [
    {
      id: "1",
      name: "Dog Treat",
      type: "Food",
      image: "/auth-bg.jpg",
      quantity: 1,
      price: 200000
    },
    {
      id: "2",
      name: "Cat Toy",
      type: "Toy",
      image: "/auth-bg.jpg",
      quantity: 2,
      price: 150000
    },
    {
      id: "1",
      name: "Dog Treat",
      type: "Food",
      image: "/auth-bg.jpg",
      quantity: 1,
      price: 200000
    },
    {
      id: "2",
      name: "Cat Toy",
      type: "Toy",
      image: "/auth-bg.jpg",
      quantity: 2,
      price: 150000
    },
    {
      id: "1",
      name: "Dog Treat",
      type: "Food",
      image: "/auth-bg.jpg",
      quantity: 1,
      price: 200000
    },
    {
      id: "2",
      name: "Cat Toy",
      type: "Toy",
      image: "/auth-bg.jpg",
      quantity: 2,
      price: 150000
    }
  ]
  const [onlineBanking, setOnlineBanking] = useState(false);

  return (
    <>
      <SectionHeader title="Your Cart" />
      <div className="text-gray-400">You have {cartList.length} items in your cart</div>
      <div className="flex justify-between gap-8 mt-[30px]">
        <div className="flex flex-col gap-4 w-3/5 border border-gray-300 p-3 rounded-lg">
          {cartList.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>
        <div className="w-2/5 sticky top-20 h-fit bg-[var(--main)] p-5 rounded-xl text-white">
          <PriceSummary total={350000} discount={0} />
          <div className="mt-5">Choose payment method</div>
          <RadioGroup 
            defaultValue="cod"
            className="mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cod" id={`cod`}  onClick={() => setOnlineBanking(false)} />
              <Label htmlFor={`cod`} className={"text-white"}>Charge on delivery</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="momo" id={`momo`} onClick={() => setOnlineBanking(false)} />
              <Label htmlFor={`momo`} className={"text-white"}>Momo</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="online-banking" id={`online-banking`} onClick={() => setOnlineBanking(true)} />
              <Label htmlFor={`online-banking`} className={"text-white"}>Online banking</Label>
            </div>
          </RadioGroup>
          {onlineBanking && (
            <div className="bg-gray-200 p-3 rounded-lg mt-4 flex flex-col gap-2">
              <div className="font-semibold text-[var(--main)]">Banking Information</div>
              <div className="text-sm text-gray-600 font-bold">Bank: <span className="font-medium">ABC Bank</span></div>
              <div className="text-sm text-gray-600 font-bold">Account Number: <span className="font-medium">123456789</span></div>
              <div className="text-sm text-gray-600 font-bold">Account Holder: <span className="font-medium">John Doe</span></div>
            </div>
          )}
          <Button className="bg-white hover:bg-gray-100 text-black w-full mt-6">
            <span>Checkout Now</span>
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
} 