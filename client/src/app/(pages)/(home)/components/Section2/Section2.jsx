import { cn } from "@/lib/utils"
import { SectionHeader } from "../SectionHeader"
import Link from "next/link"

export const Section2 = () => {
  const categoryList = [
    {
      name: "Medical Examination",
      img: "/category2.png"
    },
    {
      name: "Vaccination Single Service",
      img: "/category3.png"
    },
    {
      name: "Vaccination Package Service",
      img: "/category4.png"
    },
  ]
  
  const CategoryItem = ({ item, index }) => {
    return (
      <Link href="/service/book" className={cn(
        "border rounded-[25px] py-[50px] flex flex-col items-center justify-center gap-4 hover:opacity-80 cursor-pointer animation",
        index % 2 != 0 ? "border-[var(--main)]" : "border-yellow-300 bg-gradient-to-b from-[#FFEE94] to-[#FFF]"
      )}>
        <div className="w-20 h-20 overflow-hidden">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-[20px]">{item.name}</div>
      </Link>
    )
  }

  return (
    <>
      <div className="container mx-auto">
        <SectionHeader title={"Services Category"} />
        <div className="grid grid-cols-3 gap-10 mt-[52px]">
          {categoryList.map((item, index) => (
            <CategoryItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </>
  )
}