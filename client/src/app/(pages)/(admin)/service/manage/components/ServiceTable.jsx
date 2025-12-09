"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ServiceTable = () => {
  const router = useRouter();

  const [serviceList, setServiceList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/list`)
        .then(res => res.json())
        .then(data => {
          if (data.code == "success") {
            setServiceList(data.serviceList);
          }
        })
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border mt-5">
        <table className="min-w-full text-sm">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {serviceList.length > 0 && serviceList.map((item) => (
              <tr key={item.service_id} className="border-t">
                <td className="px-4 py-2">{item.service_name}</td>
                <td className="px-4 py-2">{item.service_base_price}</td>
                <td className="px-4 py-2 w-[500px]">
                  <div className="flex flex-wrap items-center gap-1">
                    {item.branches.map((branch, index) => (
                      <Badge key={index} className="text-[10px]">{branch.branch_name}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/service/manage/update/${item.service_id}`)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}