import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export const useAuth = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState();
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "error")
        {
          if (pathName.startsWith("/employee")) {
            router.push("/employee/auth/signin");
          }
        }
        if (data.code == "success")
        {
          setIsLogin(true);
          setUserInfo(data.userInfo);
        }
      })
  }, [pathName])

  return { isLogin, userInfo };
}