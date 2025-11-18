import { Button } from "@/components/ui/button"
import { ChevronRight, CirclePlay } from "lucide-react"

export const Section3 = () => {
  return (
    <>
      <div className="container mx-auto mt-[130px] flex justify-between gap-[70px]">
        <div className="w-1/2 h-auto overflow-hidden relative">
          <img 
            src="/section3.png"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1/8 right-1/6 animation">
            <Button className="bg-transparent hover:bg-transparent shadow-none flex flex-col">
              <CirclePlay style={{ width: 50, height: 50 }} />
              <div>Learn more</div>
            </Button>
          </div>
        </div>
        <div className="w-1/2 mt-[50px]">
          <div className="text-[34px] mb-5">Dogs do speak, but only to those who know how to listen.</div>
          <div className="text-[19px] mb-8">Sweet roll ice cream powder candy canes ice cream donut pudding biscuit ice cream. Cupcake tootsie roll sugar plum danish pudding fruitcake cheesecake jelly-o. Pie muffin topping cake. Pudding biscuit caramels topping.</div>
          <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] animation flex items-center gap-3">
            Explore more
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  )
}