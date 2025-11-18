import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export const Section1 = () => {
  return (
    <>
      <div className="bg-[url('/section1.png')] bg-no-repeat bg-cover bg-center w-full h-auto">
        <div className="container mx-auto flex items-center justify-between gap-[50px]">
          <div className="flex flex-col justify-center w-1/2">
            <div className="text-[44px] mb-[20px]">Taking care <br/> for your Smart Dog !</div>
            <div className="text-[19px]">Human–canine bonding is the relationship between dogs and humans.</div>
            <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] animation mt-[50px] w-[200px]">
              <div>Explore more</div>
              <ChevronRight />
            </Button>
          </div>
          <div className="w-1/2 h-[calc(100vh-100px)] overflow-hidden">
            <img 
              src="./section1_1.png"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </>
  )
}