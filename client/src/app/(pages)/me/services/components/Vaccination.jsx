import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"

export const Vaccination = () => {
  const vaccineData = [
    {
      name: "Rabies",
      type: "Overdue",
      date: "01 Dec 2023",
      dose: "1ml",
      doctor: "Find Veterinarian",
    },
    {
      name: "Bordetella",
      type: "Noncore",
      date: "11 Dec 2024",
      dose: "0.5ml",
      doctor: "James Grey",
    },
    {
      name: "Distemper",
      type: "Core",
      date: "27 Jun 2024",
      dose: "1ml",
      doctor: "Jim Brown",
    },
    {
      name: "Calicivirus",
      type: "Core",
      date: "16 Sep 2024",
      dose: "1ml",
      doctor: "Helen Brooks",
    },
  ];
  const currentPage = 1
  const totalPages = 3

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Vaccine</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Dose</th>
              <th className="px-4 py-3 text-left">Doctor</th>
            </tr>
          </thead>

          <tbody>
            {vaccineData.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{item.name}</td>

                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.dose}</td>

                <td className="px-4 py-3">
                  <Badge className={"bg-[var(--main)] hover:bg-[var(--main-hover)]"}>
                    {item.doctor}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
};
