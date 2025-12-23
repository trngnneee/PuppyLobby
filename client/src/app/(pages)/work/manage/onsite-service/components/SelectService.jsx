"use client"

import { VaccineItem } from "@/app/(pages)/service/book/components/Step2UI/VaccineItem/VaccineItem";
import { VaccineItemSkeleton } from "@/app/(pages)/service/book/components/Step2UI/VaccineItem/VaccineItemSkeleton";
import { VaccinePackageItem } from "@/app/(pages)/service/book/components/Step2UI/VaccinePackageItem/VaccinePackageItem";
import { VaccinePackageItemSkeleton } from "@/app/(pages)/service/book/components/Step2UI/VaccinePackageItem/VaccinePackageItemSkeleton";
import PaginationComponent from "@/components/common/Pagination";
import { Calendar } from "@/components/ui/calendar-rac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils/date";
import { paramsBuilder } from "@/utils/params";
import { useEffect, useState } from "react";

export const SelectService = ({ targetServiceInfo, setTargetServiceInfo }) => {
  const [serviceList, setServiceList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [vaccineList, setVaccineList] = useState([]);
  const [vaccinePackageList, setVaccinePackageList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/list`).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setTargetServiceInfo(prev => ({
            ...prev,
            service_id: data.serviceList[0].service_id
          }));
          setServiceList(data.serviceList);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (serviceList.find(service => service.service_id === targetServiceInfo.service_id)?.service_name == "Vaccine Single Service") {
      const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine/list`, {
        page: currentPage,
        pageSize: 12
      })
      const fetchData = async () => {
        setVaccineList([]);
        await fetch(url).then((res) => res.json()).then((data) => {
          if (data.code == "success") {
            setVaccineList(data.vaccineList);
            setTotalPages(data.totalPages);
            setTargetServiceInfo(prev => ({
              ...prev,
              vaccine: data.vaccineList.length > 0 ? data.vaccineList[0].vaccine_id : null
            }))
          }
        });
      }
      fetchData();
    }
    else {
      const fetchData = async () => {
        const url = paramsBuilder(`${process.env.NEXT_PUBLIC_API_URL}/vaccine-package/list`, {
          page: currentPage,
          pageSize: 9
        });
        await fetch(url).then((res) => res.json()).then((data) => {
          if (data.code == "success") {
            setVaccinePackageList(data.vaccinePackageList);
            setTotalPages(data.totalPages);
            setTargetServiceInfo(prev => ({
              ...prev,
              vaccinePackage: data.vaccinePackageList.length > 0 ? data.vaccinePackageList[0].package_id : null
            }));
          }
        })
      };
      fetchData();
    }
  }, [currentPage, targetServiceInfo.service_id]);

  useEffect(() => {

  }, [targetServiceInfo.service_id]);
  useEffect(() => {
    setBranchList(serviceList.find(service => service.service_id === targetServiceInfo.service_id)?.branches || []);
  }, [targetServiceInfo.service_id]);

  useEffect(() => {
    if (targetServiceInfo.branch == "") return;
    const fetchAvailableEmployee = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/list/${targetServiceInfo.branch}`).then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setEmployeeList(data.employeeList);
          }
        })
    };
    fetchAvailableEmployee();
  }, [targetServiceInfo.branch]);

  useEffect(() => {
    setTargetServiceInfo(prev => ({
      ...prev,
      service_name: serviceList.find(service => service.service_id === targetServiceInfo.service_id)?.service_name || ''
    }));
  }, [targetServiceInfo.service_id])

  return (
    <>
      <div className="flex gap-10 mt-5">
        <div className="w-full">
          <Label htmlFor="species" className="text-sm font-medium text-[var(--main)]">Service Type</Label>
          <Select value={targetServiceInfo.service_id} onValueChange={(value) => setTargetServiceInfo((prev) => ({ ...prev, service_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceList.length > 0 && serviceList.map((serviceItem) => (
                <SelectItem key={serviceItem.service_id} value={serviceItem.service_id}>
                  {serviceItem.service_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label htmlFor="date" className="text-sm font-medium text-[var(--main)]">Service Date</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Input
                type="text"
                id="exam_date"
                name="exam_date"
                value={targetServiceInfo.date}
                readOnly
                className="cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Calendar
                onChange={(date) =>
                  setTargetServiceInfo((prev) => ({
                    ...prev,
                    date: date
                  }))
                }
                value={targetServiceInfo.date}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex gap-10 mt-5">
        <div className="w-full">
          <Label htmlFor="branch" className="text-sm font-medium text-[var(--main)]">Branch</Label>
          <Select value={targetServiceInfo.branch} onValueChange={(value) => setTargetServiceInfo((prev) => ({ ...prev, branch: value }))} disabled={branchList.length == 0}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branchList.length > 0 && branchList.map((branchItem) => (
                <SelectItem
                  key={branchItem.branch_id}
                  value={branchItem.branch_id}
                >
                  {branchItem.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label htmlFor="employee" className="text-sm font-medium text-[var(--main)]">Assigned Employee</Label>
          <Select value={targetServiceInfo.employee} onValueChange={(value) => setTargetServiceInfo((prev) => ({ ...prev, employee: value }))} disabled={employeeList.length == 0}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employeeList.length > 0 && employeeList.map((employeeItem) => (
                <SelectItem
                  key={employeeItem.employee_id}
                  value={employeeItem.employee_id}
                >
                  {employeeItem.employee_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {serviceList.find((item) => item.service_id === targetServiceInfo.service_id)?.service_name == "Vaccine Single Service" && (
        <div className="flex gap-10 mt-5">
          <div className="w-full">
            <Label className="text-sm font-medium text-[var(--main)]">Please choose the type of vaccine:</Label>
            <div className="">
              <RadioGroup
                value={targetServiceInfo.vaccine}
                onValueChange={(value) => setTargetServiceInfo((prev) => ({ ...prev, vaccine: value }))}
                className="grid grid-cols-4 gap-3"
              >
                {vaccineList.length > 0 ? vaccineList.map((item) => (
                  <VaccineItem
                    key={item.vaccine_info.vaccine_id}
                    item={item}
                  />
                )) : (
                  [...Array(10)].map((_, index) => (
                    <VaccineItemSkeleton key={index} />
                  ))
                )}
              </RadioGroup>
              <div className="flex items-center justify-between gap-3 mt-5">
                <p className="grow text-sm text-muted-foreground" aria-live="polite">
                  Page <span className="text-foreground">{currentPage}</span> of{" "}
                  <span className="text-foreground">{totalPages}</span>
                </p>
                <PaginationComponent
                  numberOfPages={totalPages}
                  currentPage={currentPage}
                  controlPage={(value) => setCurrentPage(value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {serviceList.find((item) => item.service_id === targetServiceInfo.service_id)?.service_name == "Vaccine Package Service" && (
        <div className="w-full mt-5">
          <Label className="text-sm font-medium text-[var(--main)]">Please choose the type of vaccine:</Label>
          <RadioGroup
            value={targetServiceInfo.vaccinePackage}
            onValueChange={(value) => {
              console.log(value);
              setTargetServiceInfo((prev) => ({ ...prev, vaccinePackage: value }))
            }}
            className="grid grid-cols-3 gap-3"
          >
            {vaccinePackageList.length > 0 ? vaccinePackageList.map((item) => (
              <VaccinePackageItem
                key={item.vaccine_package_info.package_id}
                item={item}
              />
            )) : (
              [...Array(3)].map((_, index) => (
                <VaccinePackageItemSkeleton key={index} />
              ))
            )}
          </RadioGroup>
          <div className="flex items-center justify-between gap-3 mt-5">
            <p className="grow text-sm text-muted-foreground" aria-live="polite">
              Page <span className="text-foreground">{currentPage}</span> of{" "}
              <span className="text-foreground">{totalPages}</span>
            </p>
            <PaginationComponent
              numberOfPages={totalPages}
              currentPage={currentPage}
              controlPage={(value) => setCurrentPage(value)}
            />
          </div>
        </div>
      )}
    </>
  )
}