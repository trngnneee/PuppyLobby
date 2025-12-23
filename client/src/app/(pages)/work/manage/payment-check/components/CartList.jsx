"use client"

import { CartItem } from "@/app/(pages)/me/cart/components/CartItem"
import { ItemSkeleton } from "@/app/(pages)/me/cart/components/ItemSkeleton"
import { MedicalItem } from "@/app/(pages)/me/cart/components/MedicalItem"
import { VaccinePackageItem } from "@/app/(pages)/me/cart/components/VaccinePackageItem"
import { VaccineSingleItem } from "@/app/(pages)/me/cart/components/VaccineSingleItem"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"

export const CartList = ({ item, selected, cartList, medicalList, vaccineSingleList, vaccinePackageList, fetchCartData, loading }) => {
  return (
    <>
      <Label
        key={item.customer_id}
        htmlFor={item.customer_id}
        className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/50"
      >
        <RadioGroupItem
          id={item.customer_id}
          value={item.customer_id.toString()}
          selected={selected}
        />

        <div>
          <div className="font-medium">{item.customer_name}</div>
          <div className="text-sm text-muted-foreground">
            Phone: {item.phone_number} | CCCD: {item.cccd}
          </div>
        </div>
      </Label>
      {selected && (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 flex flex-col gap-3">
          {cartList.map((item, index) => (
            <CartItem key={item.product_id} item={item} onUpdated={fetchCartData} />
          ))}
          {medicalList.length > 0 ? medicalList.map((item) => (
            <MedicalItem key={item.booking_id} item={item} />
          )) : loading ? (
            [...Array(2)].map((_, index) => (
              <ItemSkeleton key={index} />
            ))
          ) : null}
          {vaccineSingleList.length > 0 ? vaccineSingleList.map((item) => (
            <VaccineSingleItem key={item.booking_id} item={item} />
          )) : loading ? (
            [...Array(2)].map((_, index) => (
              <ItemSkeleton key={index} />
            ))
          ) : null}
          {vaccinePackageList.length > 0 ? vaccinePackageList.map((item) => (
            <VaccinePackageItem key={item.booking_id} item={item} />
          )) : loading ? (
            [...Array(2)].map((_, index) => (
              <ItemSkeleton key={index} />
            ))
          ) : null}
          {cartList.length === 0 && medicalList.length === 0 && vaccineSingleList.length === 0 && vaccinePackageList.length === 0 && !loading && (
            <div className="text-center text-muted-foreground mt-4">
              No items in the cart.
            </div>
          )}
        </div>
      )}
    </>
  )
}