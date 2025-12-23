"use client"


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { use } from "react";
import { set } from "date-fns";

export const CartItem = ({ item, onUpdated }) => {
  const [quantity, setQuantity] = useState(Number(item.quantity));
  const [subtotal, setSubtotal] = useState(Number(quantity * item.price));
  const [isDeleting, setIsDeleting] = useState(false);
  const handleIncreaseQuantity = async () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    setSubtotal(newQty * item.price);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/update_cart_item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          invoice_id: item.invoice_id,
          product_id: item.product_id,
          quantity: newQty,
        }),
      });
      const data = await response.json();
      if (data.code !== "success") console.error(data.message);
      onUpdated();
    } catch (error) {
      console.error(error);
    }
  };


 const handleDecreaseQuantity = async () => {
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    setSubtotal(newQty * item.price);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/update_cart_item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          invoice_id: item.invoice_id,
          product_id: item.product_id,
          quantity: newQty,
        }),
      });
      const data = await response.json();
      if (data.code !== "success") console.error(data.message);
      onUpdated();
    } catch (error) {
      console.error(error);
    }
  };
  


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/remove_cart_item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            invoice_id: item.invoice_id,
            product_id: item.product_id,
          }),
        }
      );

      const data = await response.json();
      if (data.code === "success") {
        onUpdated(); 
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full rounded-xl py-3 px-5 bg-gray-100">
      
      <div className="flex items-center gap-3">
        <img
          src={item.images[0]}
          alt={item.product_name}
          className="w-14 h-14 rounded-lg object-cover"
        />

        <div>
          <h3 className="font-semibold text-base line-clamp-2">{item.product_name}</h3>
          <p className="text-gray-500 text-sm">{item.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <span className="font-semibold">{quantity}</span>
        <div className="flex flex-col">
          <Button onClick={handleIncreaseQuantity}
            className="bg-gray-100 hover:bg-gray-200 text-black shadow-none px-2 rounded"
          >
            <ChevronUp size={16} />
          </Button>
          <Button onClick={handleDecreaseQuantity}
            className="bg-gray-100 hover:bg-gray-200 text-black shadow-none px-2 rounded"
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      <div className="font-semibold">{subtotal.toLocaleString("vi-VN")} VND</div>

      <Button onClick={handleDelete}
        className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};
