import { Button } from "@/components/ui/button"
import Link from "next/link"

export const Header = () => {
  const navList = [
    {
      name: "OUR SERVICES",
      link: "#"
    },
    {
      name: "ABOUT US",
      link: "#"
    },
    {
      name: "PRODUCTS",
      link: "#"
    },
    {
      name: "PET CARE",
      link: "#"
    },
    {
      name: "CONTACT",
      link: "#"
    },
  ]
  
  const NavItem = ({ item }) => {
    return (
      <Link href={item.link} className="animation text-sm font-bold">
        {item.name}
      </Link>
    )
  }
  
  return (
    <>
      <div className="container mx-auto flex my-10 justify-between items-center">
        <div className="w-[200px] h-auto overflow-hidden">
          <img src="./logo.png" className="w-full h-full object-container" />
        </div>
        <div className="flex gap-[57px] items-center flex-1 justify-center">
          {navList.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>
        <div className="flex items-center gap-[20px]">
          <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white font-bold animation">SIGN IN</Button>
          <Button className="bg-[#C7E7E1] hover:bg-[#c4f5ecb9] text-[var(--main)] font-bold animation">SIGN IN</Button>
        </div>
      </div>
    </>
  )
}