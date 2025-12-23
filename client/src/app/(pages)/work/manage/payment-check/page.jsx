"use client"

import { useEffect, useState } from "react"
import { SectionHeader } from "../components/SectionHeader"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PriceSummary } from "@/app/(pages)/me/cart/components/PriceSummary"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { CartList } from "./components/CartList"

export default function PaymentCheckPage() {
  const [customerList, setCustomerList] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [onlineBanking, setOnlineBanking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/anonymous-list`
      )
      const data = await res.json()

      if (data.code === "success") {
        setCustomerList(data.customers)
      }
    }
    fetchData()
  }, [])

  const [cartList, setCartList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [medicalList, setMedicalList] = useState([]);
  const [vaccineSingleList, setVaccineSingleList] = useState([]);
  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCartData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${selectedCustomer}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.code === "success") {
        setCartList(data.cartItems);
        setTotalAmount(data.totalAmount);
        setMedicalList(data.medicalExaminations || []);
        setVaccineSingleList(data.vaccinationSingles || []);
        setVaccinePackageList(data.vaccinationCombos || []);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    setCartList([]);
    setTotalAmount(0);
    setMedicalList([]);
    setVaccineSingleList([]);
    setVaccinePackageList([]);
    fetchCartData();
  }, [selectedCustomer]);

  return (
    <>
      <SectionHeader title="Customer without account List" />

      <div className="flex gap-10">
        <div
          className="w-full mt-5"
        >
          <RadioGroup
            value={selectedCustomer}
            onValueChange={setSelectedCustomer}
          >
            {customerList.map((item, index) => (
              <CartList item={item} key={index} selected={selectedCustomer === item.customer_id.toString()} cartList={cartList} medicalList={medicalList} vaccineSingleList={vaccineSingleList} vaccinePackageList={vaccinePackageList} fetchCartData={fetchCartData} loading={loading} />
            ))}
          </RadioGroup>
        </div>
        <div className="w-1/2 bg-red-100 p-5 rounded-lg h-[100px]">
          <div className="sticky top-20 h-fit bg-[var(--main)] p-5 rounded-xl text-white">
            <PriceSummary total={totalAmount} discount={0} />
            <div className="mt-5">Choose payment method</div>
            <RadioGroup
              defaultValue="cod"
              className="mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cod" id={`cod`} onClick={() => setOnlineBanking(false)} />
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
      </div>
    </>
  )
}