"use client"

import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";

export const CartItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between w-full rounded-xl py-3 px-5 bg-gray-100">
      
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-14 h-14 rounded-lg object-cover"
        />

        <div>
          <h3 className="font-semibold text-base">{item.name}</h3>
          <p className="text-gray-500 text-sm">{item.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <span className="font-semibold">{item.quantity}</span>
        <div className="flex flex-col">
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-black shadow-none px-2 rounded"
          >
            <ChevronUp size={16} />
          </Button>
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-black shadow-none px-2 rounded"
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      <div className="font-semibold">{item.price.toLocaleString("vi-VN")} VND</div>

      <Button
        className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};
