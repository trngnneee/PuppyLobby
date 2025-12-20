"use client"

import { useEffect, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { CartItem } from "./components/CartItem";
import { PriceSummary } from "./components/PriceSummary";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { se } from "date-fns/locale";

export default function MeCartPage() {
  const [cartList, setCartList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    // Fetch cart data from server
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.code === "success") {
          setCartList(data.cartItems);
          setTotalAmount(data.totalAmount);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  //console.log("Cart List:", data.totalAmount);

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
          <PriceSummary total={totalAmount} discount={0} />
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