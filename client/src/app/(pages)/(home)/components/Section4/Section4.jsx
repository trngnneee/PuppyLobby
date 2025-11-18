import { Button } from "@/components/ui/button"
import { SectionHeader } from "../SectionHeader"
import { ChevronRight } from "lucide-react"
import { ProductItem } from "@/app/(pages)/components/ProductItem"

export const Section4 = () => {
  const productList = [
    {
      image: "/product1.png",
      name: "Drools | 3 KG",
      desc: "Adult chicken and egg Egg, Chicken 3 kg Dry Adult Dog Food"
    },
    {
      image: "/product2.png",
      name: "Cannie Creek 4 KG",
      desc: "Adult chicken and egg Egg, Chicken 3 kg Dry Adult Dog Food"
    },
    {
      image: "/product3.png",
      name: "Biscork Biscuits",
      desc: "Adult chicken and egg Egg, Chicken  Dry Adult Dog Food"
    },
  ]
  
  return (
    <>
      <div className="container mx-auto mt-[72px]">
        <SectionHeader 
          title={"Dog Nutrients & Food"}
        />
        <div className="flex justify-between items-center">
          <div className="uppercase text-[40px] font-bold mt-[38px]">25% Off All <span className="font-medium">products</span></div>
          <Button className="flex items-center gap-3 bg-[var(--main)] hover:bg-[var(--main-hover)] animation">
            <div>View more</div>
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-[109px] mt-[55px]">
          {productList.map((item, index) => (
            <ProductItem 
              key={index}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  )
}