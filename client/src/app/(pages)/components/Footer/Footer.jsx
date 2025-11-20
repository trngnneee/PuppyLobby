import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Facebook, Instagram, Mail } from "lucide-react"

export const Footer = () => {
  return (
    <>
      <div className="bg-[#F6FAF9] pt-[85px] pb-[20px]">
        <div className="container mx-auto">
          <div className="text-[34px] text-center">Join us with Puppy Lobby</div>
          <div className="flex items-center gap-5 bg-white p-[33px] mt-[50px]">
            <Mail />
            <Input placeholder="Enter your email" />
            <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] shadow-none animation">
              <div>Submit now</div>
              <ChevronRight />
            </Button>
          </div>
          <div className="mt-[100px] flex justify-between pb-[50px] border-b border-b-[#C7C7C7]">
            <div>
              <div className="font-bold text-sm mb-[11px]">Follow on social</div>
              <div className="flex gap-5">
                <div className="bg-[#C4C4C4] p-2 rounded-full w-[58px] h-[58px] flex items-center justify-center">
                  <Facebook />
                </div>
                <div className="bg-[#C4C4C4] p-2 rounded-full w-[58px] h-[58px] flex items-center justify-center">
                  <Instagram />
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-[11px]">Contact</div>
              <div className="font-bold text-[22px] text-[var(--main)]">(+84) 123 456 789</div>
              <div className="text-[18px] text-[#757777]">227 Nguyen Van Cu, District 5, Ho Chi Minh City</div>
            </div>
          </div>
          <div className="flex justify-between mt-[29px]">
            <div className="text-[#414141]"> © 2025 PuppyLobby all rights reserved</div>
            <div className="flex items-center gap-[57px]">
              <div className="text-sm">Our services</div>
              <div className="text-sm">About us</div>
              <div className="text-sm">Shipping</div>
              <div className="text-sm">FAQ</div>
              <div className="text-sm">Contact</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}