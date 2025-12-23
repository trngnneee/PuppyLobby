"use client"

import { Input } from "@/components/ui/input"
import { SectionHeader } from "../components/SectionHeader"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { ExistUserUI } from "./components/ExistUserUI"
import { NoneExistUserUI } from "./components/NoneExistUserUI"
import { SelectService } from "./components/SelectService"
import { getLocalTimeZone, today } from "@internationalized/date"
import { Button } from "@/components/ui/button"
import { handleSubmit } from "./helper/HandleSubmit"
import { useRouter } from "next/navigation"

export default function OnsiteServicePage() {
  const router = useRouter();
  const [fetchingCustomer, setFetchingCustomer] = useState(false)
  const [customerExist, setCustomerExist] = useState(false)

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    customerID: null,
    customerName: '',
    phoneNumber: '',
    citizenID: ''
  })

  const [petList, setPetList] = useState([])

  const [newPetCreate, setNewPetCreate] = useState(false);

  // Exist customer
  const [targetPet, setTargetPet] = useState(null);
  // None exist customer
  const [petInfo, setPetInfo] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    healthStatus: 'healthy'
  });

  // Service Infor
  const [targetServiceInfo, setTargetServiceInfo] = useState({
    service_id: '',
    service_name: '',
    date: today(getLocalTimeZone()),
    branch: '',
    employee: '',
    vaccine: '',
    package: ''
  })

  useEffect(() => {
    if (customerInfo.phoneNumber == "") {
      setFetchingCustomer(false);
      setCustomerInfo({
        ...customerInfo,
        customerID: null,
        customerName: '',
        citizenID: ''
      });
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/find?phone_number=${customerInfo.phoneNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setCustomerExist(true);
            setCustomerInfo({
              customerID: data.existCustomer.customer_id,
              customerName: data.existCustomer.customer_name,
              phoneNumber: data.existCustomer.phone_number,
              citizenID: data.existCustomer.cccd
            });
          } else {
            setCustomerExist(false);
            setCustomerInfo({
              ...customerInfo,
              customerID: null,
              customerName: '',
              citizenID: ''
            });
          }
          setFetchingCustomer(true);
        })
    }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
    return () => clearTimeout(timeout);
  }, [customerInfo.phoneNumber])

  useEffect(() => {
    if (!customerInfo.phoneNumber || !customerInfo.customerName || !customerInfo.citizenID || !fetchingCustomer || !customerExist) {
      setPetList([]);
      return;
    }
    const fetchPetList = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pet/find?phone_number=${customerInfo.phoneNumber}&customer_name=${customerInfo.customerName}&citizen_id=${customerInfo.citizenID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setPetList(data.petList);
          }
          else {
            setPetList([]);
          }
        })
    };
    fetchPetList();
  }, [customerInfo.phoneNumber, customerInfo.customerName, customerInfo.citizenID])

  return (
    <>
      <SectionHeader title="Create new Onsite Service" />
      <form className="mt-5" onSubmit={(event) => handleSubmit(
        event,
        {
          customerInfo,
          newPetCreate,
          petInfo,
          targetPet,
          targetServiceInfo,
          router
        }
      )}>
        <div className="flex gap-5">
          <div className="w-full">
            <Label htmlFor="phone_number" className="text-sm font-medium text-[var(--main)]">Phone number</Label>
            <Input
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="0123456789"
              value={customerInfo.phoneNumber}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
            />
          </div>
          {!fetchingCustomer && (
            <>
              <div className="w-full"></div>
              <div className="w-full"></div>
            </>
          )}
          {fetchingCustomer && (
            <>
              <div className="w-full">
                <Label htmlFor="customer_name" className="text-sm font-medium text-[var(--main)]">Customer name</Label>
                <Input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  placeholder="John Doe"
                  value={customerInfo.customerName}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
                  readOnly={customerExist}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="cccd" className="text-sm font-medium text-[var(--main)]">Citizen ID</Label>
                <Input
                  type="text"
                  id="cccd"
                  name="cccd"
                  placeholder="123456789"
                  value={customerInfo.citizenID}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, citizenID: e.target.value })}
                  readOnly={customerExist}
                />
              </div>
            </>
          )}
        </div>
        {petList.length > 0 && (
          !newPetCreate ?
            (
              <>
                <Button type="button" onClick={() => {
                  setNewPetCreate(true);
                  setTargetPet(null);
                }} className={"bg-[var(--main)] hover:bg-[var(--main-hover)] mt-5"}>Book a service for new pet</Button>
                <ExistUserUI petList={petList} targetPet={targetPet} setTargetPet={setTargetPet} />
              </>
            ) :
            (
              <>
                <Button type="button" onClick={() => {
                  setNewPetCreate(false);
                }} className={"bg-[var(--main)] hover:bg-[var(--main-hover)] mt-5"}>Book a service for existing pet</Button>
                <NoneExistUserUI petInfo={petInfo} setPetInfo={setPetInfo} />
              </>
            )
        )}
        {petList.length == 0 && fetchingCustomer && (
          <NoneExistUserUI petInfo={petInfo} setPetInfo={setPetInfo} />
        )}
        {fetchingCustomer && (
          <SelectService targetServiceInfo={targetServiceInfo} setTargetServiceInfo={setTargetServiceInfo} />
        )}
        <Button type="submit" className={"bg-[var(--main)] hover:bg-[var(--main-hover)] w-full mt-5"}>Create Onsite Service</Button>
      </form>
    </>
  )
}