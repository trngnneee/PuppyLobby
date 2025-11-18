import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export const Section5 = () => {
  return (
    <>
      <div className="bg-linear-to-b from-[#4ab0d234] to-white mt-[69px] h-screen">
        <div className="container mx-auto flex justify-between items-center gap-[100px] py-[74px]">
          <div className="w-1/2">
            <div className="text-[34px] mb-7">No one appreciates the very special genius of your conversation as the dog does.</div>
            <div className="text-[19px] text-[#4E4C46] mb-[55px]">Sweet roll ice cream powder candy canes ice cream donut pudding biscuit ice cream.biscuit caramels topb</div>
            <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] shadow-none flex items-center gap-3 animation">
              <div>Explore more</div>
              <ChevronRight />
            </Button>
          </div>
          <div className="w-2/3 h-[600px] overflow-hidden">
            <img 
              src="/section5.png"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </>
  )
}