import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import {ShoppingCart } from 'lucide-react';
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
export const ProductCard = ({ item, index }) => {
    const router = useRouter();
    const {ref, hasIntersected} = useIntersectionObserver({threshold: 0.1});
    const plateIndex = index % 3 === 0 ? 1 : index % 2 === 0 ? 2 : 3;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const isExpiringSoon = (expireDate) => {
        if (!expireDate) return false;
        const today = new Date();
        const expire = new Date(expireDate);
        const daysUntilExpire = Math.ceil((expire - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpire <= 30 && daysUntilExpire > 0;
    };

    const isExpired = (expireDate) => {
        if (!expireDate) return false;
        const today = new Date();
        const expire = new Date(expireDate);
        return expire < today;
    };

    const handleAddToCart = () => {
        const finalData = {
        product_id: item.product_info.product_id,
        quantity: 1, // Default quantity
        }

        const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/add_to_cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(finalData)
            })
            .then((res) => res.json())
            .then((data) => {
                return data;
            });

        toast.promise(promise, {
            loading: "Adding product to cart...",
            success: (data) => {
                if (data.code == "success") {
                router.push('/');
                return data.message;
                }
            },
            error: (err) => err.message
            })
    };

  return (
    <div ref = {ref} className={`group cursor-pointer transition-all rounded-[5px] hover:scale-105 hover:shadow-[0px_0px_10px] hover:shadow-rose-500 duration-300 flex flex-col h-full
     ${hasIntersected ? 'animate__animated animate__zoomIn animate_fast ' : 'opacity-0'}`}>
  
        {/* IMAGE */}
        <div className="w-full h-[350px] overflow-hidden relative bg-white rounded-lg shadow-sm flex-shrink-0">
            {/* PLATE */}
            <div className="absolute bottom-0 w-full z-0">
                <img
                src={`/product_plate_${plateIndex}.png`}
                alt="plate"
                className="w-full object-contain"
                />
            </div>

            {/* PRODUCT IMAGE */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="w-[75%] aspect-square group-hover:scale-110 transition-transform duration-500">
                <img
                    src={item.product_info?.images[0]}
                    alt={item.product_info?.product_name}
                    className="w-full h-full object-contain"
                />
                </div>
            </div>
        </div>

        <div className="mt-4 flex flex-col flex-1">
             <div className="flex-1 overflow-y-auto pr-1">
            <h3 className="text-[24px] font-semibold text-gray-900 mb-2 line-clamp-3">
            {item.product_info?.product_name}
            </h3>
            {item.product_info?.description && (<p className="text-[16px] text-[#979697] mb-3">
            {item.product_info?.description || 'Premium pet product'}
            </p>)}

            {item.extra_info.dosage_use && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-2">
                <span className="font-semibold">Dosage Uses:</span> {item.extra_info.dosage_use}
            </p>
            )}

            {item.extra_info.side_effect && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-2">
                <span className="font-semibold">Side Effect:</span> {item.extra_info.side_effect}
            </p>
            )}



            {item.extra_info.species && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-1">
                <span className="font-semibold">Species:</span> {item.extra_info.species}
            </p>
            )}

            {item.extra_info.nutrition_description && (
            <p className="text-[20px] text-gray-700 mb-2 line line-clamp-2">
                <span className="font-semibold">Nutrition Description:</span> {item.extra_info.nutrition_description}
            </p>
            )}

            {item.extra_info?.size && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-1">
                <span className="font-semibold">Size:</span> {item.extra_info.size}
            </p>
            )}

            {item.extra_info?.color && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-1">
                <span className="font-semibold">Color:</span> {item.extra_info.color}
            </p>
            )}

            {item.extra_info?.material && (
            <p className="text-[20px] text-gray-700 mb-2 line-clamp-1">
                <span className="font-semibold">Material:</span> {item.extra_info.material}
            </p>
            )}

            {item.product_info?.expiry_date && (
            <p className={`text-[14px] font-semibold mb-3 px-2 py-1 rounded inline-block line-clamp-1 ${
                isExpired(item.product_info.expiry_date)
                ? 'bg-red-50 text-red-600'
                : isExpiringSoon(item.product_info.expiry_date)
                ? 'bg-orange-50 text-orange-600'
                : 'bg-green-50 text-green-600'
            }`}>
                {isExpired(item.product_info.expiry_date) 
                ? '❌ Expired: ' 
                : isExpiringSoon(item.product_info.expiry_date)
                ? '⚠️ Expires: '
                : '✓ Expires: '
                }
                {formatDate(item.product_info.expiry_date)}
            </p>
            )}
            
          

            </div>

            <div className="mt-auto"> 
                 {item.product_info?.price && (
            <p className="text-[24px] font-bold text-blue-600 mb-4 line-clamp-1">
                ${parseInt(item.product_info.price).toLocaleString('en-US')}
            </p>
            )}

            <div className="flex gap-3">
            <button onClick={handleAddToCart}
            className="flex-1 bg-transparent hover:bg-[#00000015] border-2 border-[#6B4FD9] rounded-[6px] text-[#6B4FD9] text-[22px] font-medium py-3 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Add to cart
            </button>
            </div>
            </div>
           
        </div>
    </div>
  );
};