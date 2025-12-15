import { SectionHeader } from "../SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Step1UISkeleton } from "./Step1UISkeleton";

export const Step1UI = ({ selectedService, setSelectedService, serviceList }) => {  
  return (
    <>
      <SectionHeader title="Step 1: Select Service" />
      <fieldset className="mt-5">
        <div className="mb-3">Choose plan</div>
        <RadioGroup
          className="-space-y-px gap-0 rounded-md shadow-xs"
          value={selectedService.service_id}
          onValueChange={(value) => setSelectedService({
            service_id: value,
            service_name: serviceList.find((item) => item.service_id == value)?.service_name
          })}
        >
          {serviceList.length > 0 ? serviceList.map((item, index) => (
            <div
              className="relative flex flex-col gap-4 border border-input p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10 has-data-[state=checked]:border-[var(--main)] has-data-[state=checked]:bg-accent"
              key={index}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    aria-describedby={`${item.service_id}`}
                    className="after:absolute after:inset-0"
                    id={item.service_id}
                    value={item.service_id}
                  />
                  <Label
                    className="inline-flex items-start"
                    htmlFor={item.service_id}
                  >
                    {item.service_name}
                  </Label>
                </div>
                <div
                  className="max-w-1/2"
                  id={item.service_id}
                >
                  <div>
                    {item.branches.map((branch, idx) => (
                      <Badge className={"text-[10px] bg-[var(--main)]"} key={idx}>{branch.branch_name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            [...Array(3)].map((_, idx) => (
              <Step1UISkeleton key={idx} />
            ))
          )}
        </RadioGroup>
      </fieldset>
    </>
  )
}