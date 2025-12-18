import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline"
import { formatDate } from "@/utils/date"
import { CheckIcon } from "lucide-react"
import { useState } from "react"

export const EmployeeHistory = () => {
  const [historyList, setHistoryList] = useState([])
  const handleSubmit = async (e) => {
    setHistoryList([]);
    e.preventDefault();
    const email = e.target.email.value;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setHistoryList(data.history)
        }
      })
  }

  return (
    <>
      <div>
        <div>Please provide email to check the employee history.</div>
        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-5">
          <div className="mb-[15px] w-full">
            <Label htmlFor="email" className="text-sm font-medium text-[var(--main)]">Email</Label>
            <Input
              type="text"
              id="email"
              name="email"
            />
          </div>
          <Button className={"bg-[var(--main)] hover:bg-[var(--main-hover)] mt-2"}>Check</Button>
        </form>
      </div>
      {historyList.length > 0 ? (
        <div className="mt-5 text-sm text-gray-500 flex justify-center w-full">
          <Timeline defaultValue={historyList.length - 2}>
            {historyList.map((item, index) => (
              <TimelineItem
                key={`${item.branch_id}-${item.start_date}`}
                step={index}
                className="sm:group-data-[orientation=vertical]/timeline:ms-32"
              >
                <TimelineHeader>
                  <TimelineSeparator />

                  <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
                    {formatDate(item.start_date)}
                  </TimelineDate>

                  <TimelineTitle className="sm:-mt-0.5">
                    <span className="capitalize">{item.position}</span> · {item.branch_name}
                  </TimelineTitle>

                  <TimelineIndicator className="group-data-[orientation=vertical]/timeline:-left-6 flex size-4 items-center justify-center group-data-completed/timeline-item:border-none group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
                    <CheckIcon
                      className="group-not-data-completed/timeline-item:hidden"
                      size={16}
                    />
                  </TimelineIndicator>
                </TimelineHeader>

                <TimelineContent>
                  <div className="text-[12px]">
                    Salary: {Number(item.salary).toLocaleString()}
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>

        </div>
      ) : (
        <div className="text-center text-gray-400">No history to show.</div>
      )}
    </>
  )
}