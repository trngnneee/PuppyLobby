import { Bone } from "lucide-react"
import { SectionHeader } from "../SectionHeader"
import { cn } from "@/lib/utils"

export const Section6 = () => {
  const data = [
    {
      image: "/customer1.png",
      name: "Anna & Tobby",
      review: "Amazing Products & Delivery on time.",
      star: 4.5
    },
    {
      image: "/customer2.png",
      name: "Christine & Tom",
      review: "Love the overall Shopping experience!",
      star: 3.9
    },
    {
      image: "/customer3.png",
      name: "Sindy & Kitch",
      review: "Kitch is love food from the pup-hub",
      star: 4.6
    },
  ]

  const FeedbackItem = ({ item, index }) => {
    return (
      <div className="h-[400px] py-20 px-5 animation">
        <div className={cn(
          "relative w-full h-full rounded-t-[20px] flex flex-col items-center",
          index == 0 ? "bg-[#FFF1A6]" : index == 1 ? "bg-[#EBA8BF]" : "bg-[#DDC7ED]"
        )}>
          <img
            src={item.image}
            className="w-[323px] h-auto absolute bottom-0 left-1/2 -translate-x-1/2 z-5"
          />
        </div>
        <div className="bg-[var(--main)] rounded-b-[20px] flex flex-col items-center py-3 z-10 relative overflow-hidden">
          <div className="text-[#FFF1A6] text-[28px]">{item.name}</div>
          <div className="text-white text-sm">{item.review}</div>
          <div className="flex items-center justify-between gap-5 pb-4">
            <div className="flex items-center gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const roundedStar = item.star > 4.5 ? 5 : 4;
                return (
                  <Bone
                    fill={index < roundedStar ? "#FFF1A6" : "var(--main)"}
                    className={index < roundedStar ? "text-[#FFF1A6]" : "text-[#ccc]"}
                    key={index}
                  />
                );
              })}
            </div>
            <div className="text-[#FFF1A6] translate-y-1">{item.star}/5</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto mb-[100px]">
        <SectionHeader title={"Happy Customer"} />
        <div className="grid grid-cols-3 gap-10">
          {data.map((item, index) => (
            <FeedbackItem item={item} index={index} key={index} />
          ))}
        </div>
      </div>
    </>
  )
}