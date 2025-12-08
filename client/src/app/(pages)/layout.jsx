import { EmployeeProvider } from "@/provider/employee.provider";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header";

export default function HomeLayout({ children }){
  return (
    <EmployeeProvider>
      <Header />
      <div>
        {children}
      </div>
      <Footer />
    </EmployeeProvider>
  )
}