import { Button } from "@/components/ui/button"

export const ProductItem = ({ item, index }) => {
  const plateIndex = index % 3 === 0 ? 1 : index % 2 === 0 ? 2 : 3;
  
  return (
    <>
      <div className="animation">
        <div className="w-full h-[350px] overflow-hidden relative">
          <img
            src={item.image}
            className="w-full h-[300px] object-contain z-10 relative"
          />
          <div className="absolute bottom-0 z-0 w-full">
            <img 
              src={`/product_plate_${plateIndex}.png`}
              className="w-full object-contain"
            />
          </div>
        </div>
        <div className="">
          <div className="text-[28px]">{item.name}</div>
          <div className="text-[16px] text-[#979697] mb-4">{item.desc}</div>
          <Button className="bg-transparent hover:bg-[#00000015] shadow-none border-2 border-[var(--main) rounded-[6px] text-[var(--main)] text-[22px] font-medium">Buy Now</Button>
        </div>
      </div>
    </>
  )
}