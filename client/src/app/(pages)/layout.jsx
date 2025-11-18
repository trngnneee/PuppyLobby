import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header";

export default function HomeLayout({ children }){
  return (
    <>
      <Header />
      <div>
        {children}
      </div>
      <Footer />
    </>
  )
}