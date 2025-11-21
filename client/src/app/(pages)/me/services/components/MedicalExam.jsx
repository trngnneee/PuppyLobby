import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { MedicalItem } from "./MedicalItem"
import { Button } from "@/components/ui/button"

export const MedicalExam = () => {
  const medicList = [
    {
      doctor: "Nguyen Hoang Minh",
      pet: "Buddy",
      symptoms: "Chan an, met moi, thinh thoang non nhe.",
      diagnosis: "Viem da day nhe, can theo doi them.",
      prescription: [
        "Thuoc chong non – 2 lan/ngay",
        "Bo sung dien giai – 1 lan/ngay",
        "An de tieu, chia thanh nhieu bua nho"
      ],
      followUpDate: "2025-11-28"
    },
    {
      doctor: "Tran Thi Hoa",
      pet: "Max",
      symptoms: "Dau dau, sot cao, ho kho.",
      diagnosis: "Cam cum thong thuong, nghi ngoi va uong nuoc nhieu.",
      prescription: [
        "Thuoc giam dau ha sot – khi can thiet",
        "Nghi ngoi tai nha",
        "Uong nhieu nuoc am"
      ],
      followUpDate: "2025-12-05"
    },
    {
      doctor: "Le Van Nam",
      pet: "Luna",
      symptoms: "Vet thuong khong lanh, sut can nhanh.",
      diagnosis: "Viem loet da nang, can cham soc ky luong.",
      prescription: [
        "Thuoc khang sinh – 2 lan/ngay",
        "Ve sinh vet thuong hang ngay",
        "An uong day du dinh duong"
      ],
      followUpDate: "2025-11-30"
    }
  ]
  const currentPage = 1
  const totalPages = 5

  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-5">
        {medicList.map((item, index) => (
          <div key={index} className="mb-4">
            <MedicalItem item={item} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <p className="grow text-sm text-muted-foreground" aria-live="polite">
          Page <span className="text-foreground">{currentPage}</span> of{" "}
          <span className="text-foreground">{totalPages}</span>
        </p>
        <Pagination className="w-auto">
          <PaginationContent className="gap-3">
            <PaginationItem>
              <Button
                variant="outline"
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={currentPage === 1 ? true : undefined}
                role={currentPage === 1 ? "link" : undefined}
                asChild
              >
                <a
                >
                  Previous
                </a>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={currentPage === totalPages ? true : undefined}
                role={currentPage === totalPages ? "link" : undefined}
                asChild
              >
                <a
                >
                  Next
                </a>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}