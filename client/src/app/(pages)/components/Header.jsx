"use client"

import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const Header = () => {
  const router = useRouter();
  const { isLogin, userInfo } = useAuth();
  const navList = [
    {
      name: "HOME",
      link: "/",
    },
    ...(userInfo?.role === "customer"
      ? [
        {
          name: "BOOKING A SERVICES",
          link: "/service/book",
        },
      ]
      : []),
  ];

  const NavItem = ({ item }) => {
    return (
      <Link href={item.link} className="animation text-sm font-bold">
        {item.name}
      </Link>
    )
  }

  const navigationLinks = [
    {
      items: [
        {
          description: "Sign in as Customer",
          href: "/me/auth/signin",
        },
        {
          description: "Sign in as Employee",
          href: "/employee/auth/signin",
        },
      ],
      label: "Sign In",
      submenu: true,
    }
  ];

  return (
    <>
      <div className="container mx-auto flex my-10 justify-between items-center">
        <div className="w-[200px] h-auto overflow-hidden">
          <img src="/logo.png" className="w-full h-full object-container" />
        </div>
        <div className="flex gap-[57px] items-center flex-1 justify-center">
          {navList.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>
        {!isLogin ? (
          <div className="flex items-center gap-[20px]">
            <NavigationMenu className="max-md:hidden" viewport={false}>
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white font-bold animation">
                          <NavigationMenuLink href="/me/auth/signin" className="bg-transparent hover:bg-transparent">
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-64"
                                : "min-w-48",
                            )}
                          >
                            {link.items.map((item, index) => (
                              <li key={index}>
                                <NavigationMenuLink
                                  className="py-1.5"
                                  href={item.href}
                                >
                                  {item.description}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <Button onClick={() => router.push("/me/auth/signup")} className="bg-[#C7E7E1] hover:bg-[#c4f5ecb9] text-[var(--main)] font-bold animation">SIGN UP</Button>
          </div>
        ) : (userInfo && userInfo.role == "employee") ? (
          <div className="flex items-center gap-3">
            {
              userInfo.is_manager && (
                <Button onClick={() => router.push("/employee/manage")} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white font-bold animation">MANAGE DASHBOARD</Button>
              )
            }
            {
              (
                <Button onClick={() => router.push("/work/manage/medical-exam")} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white font-bold animation">WORK ASSIGNMENT</Button>
              )
            }
            <Button
              variant={"destructive"}
              className={"animation"}
              onClick={async () => {
                const promise = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/auth/signout`, {
                  method: 'GET',
                  credentials: 'include'
                })
                  .then((res) => res.json())
                  .then((data) => {
                    return data;
                  })
                toast.promise(promise, {
                  loading: 'Signing out...',
                  success: 'Signed out successfully!',
                  error: 'Error signing out!'
                });
                window.location.href = "/employee/auth/signin";
              }}
            >
              SIGN OUT
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {
              userInfo.role == "customer" && (
                <Button onClick={() => router.push("/me/profile")} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white font-bold animation">MANAGE PROFILE</Button>
              )
            }
            <Button
              variant={"destructive"}
              className={"animation"}
              onClick={async () => {
                const promise = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/auth/signout`, {
                  method: 'GET',
                  credentials: 'include'
                })
                  .then((res) => res.json())
                  .then((data) => {
                    return data;
                  })
                toast.promise(promise, {
                  loading: 'Signing out...',
                  success: 'Signed out successfully!',
                  error: 'Error signing out!'
                });
                window.location.href = "/me/auth/signin";
              }}
            >
              SIGN OUT
            </Button>
          </div>
        )}
      </div >
    </>
  )
}