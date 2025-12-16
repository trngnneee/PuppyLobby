"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Step1UI } from "./components/Step1UI/Step1UI";
import { Step2UIMedicalExam } from "./components/Step2UI/Step2UI-MedicalExam";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Step3UIMedicalExam } from "./components/Step3UI/Step3UI-MedicalExam";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Step2UIVaccineSingle } from "./components/Step2UI/Step2UI-VaccineSingle";
import { Step3UIVaccineSingle } from "./components/Step3UI/Step3-VaccineSingle";
import { Step2UIVaccinePackage } from "./components/Step2UI/Step2UI-VaccinePackage";
import { Step3UIVaccinePackage } from "./components/Step3UI/Step3UI-VaccinePackage";

export default function BookingServicePage() {
  const router = useRouter();
  const steps = [1, 2, 3, 4];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState({
    service_name: null,
    service_id: null
  });
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const [branch, setBranch] = useState(null);
  const [pet, setPet] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [vaccine, setVaccine] = useState(null);

  const [vaccinePackage, setVaccinePackage] = useState(null);

  // Fetch Data
  const [serviceList, setServiceList] = useState([]);
  const [petList, setPetList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/list`).then((res) => res.json()).then((data) => {
        if (data.code == "success") {
          setServiceList(data.serviceList);
        }
      })
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pet/list`, {
        method: "GET",
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setPetList(data.petList);
          }
        })
    };
    fetchData();
  }, [])

  const [availableEmployee, setAvailableEmployee] = useState([]);
  useEffect(() => {
    if (branch == null) return;
    const fetchAvailableEmployee = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/list/${branch}`).then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setAvailableEmployee(data.employeeList);
          }
        })
    };
    fetchAvailableEmployee();
  }, [branch])

  // Handle Submit
  useEffect(() => {
    if (currentStep === 4) {
      if (selectedService.service_name == "Medical Examination") {
        const finalData = {
          service_id: selectedService.service_id,
          date: date.toString(),
          branch_id: branch,
          pet_id: pet,
          employee_id: employee
        };

        const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/medical-exam/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(finalData)
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          });

        toast.promise(promise, {
          loading: "Booking your medical examination...",
          success: (data) => {
            if (data.code == "success") {
              router.push('/');
              return data.message;
            }
          },
          error: (err) => err.message
        })
      }
      if (selectedService.service_name == "Vaccine Single Service") {
        const finalData = {
          service_id: selectedService.service_id,
          date: date.toString(),
          branch_id: branch,
          pet_id: pet,
          employee_id: employee,
          vaccine_id: vaccine
        }
        const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-single/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(finalData)
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          });

        toast.promise(promise, {
          loading: "Booking your vaccine single service...",
          success: (data) => {
            if (data.code == "success") {
              router.push('/');
              return data.message;
            }
          },
          error: (err) => err.message
        })
      }
      if (selectedService.service_name == "Vaccine Package Service") {
        const finalData = {
          service_id: selectedService.service_id,
          date: date.toString(),
          branch_id: branch,
          pet_id: pet,
          employee_id: employee,
          package_id: vaccinePackage
        }
        const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/vaccine-package/book`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(finalData)
        })
          .then((res) => res.json())
          .then((data) => {
            return data;
          });

        toast.promise(promise, {
          loading: "Booking your vaccine single service...",
          success: (data) => {
            if (data.code == "success") {
              router.push('/');
              return data.message;
            }
          },
          error: (err) => err.message
        })
      }
    }
  }, [currentStep])

  return (
    <div className="container mx-auto my-10">
      <div className="mb-10">
        {currentStep == 1 && (
          <Step1UI
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            serviceList={serviceList}
          />
        )}
        {currentStep == 2 && (
          selectedService.service_name == "Medical Examination" ? (
            <Step2UIMedicalExam
              availableBranch={serviceList.find((service) => service.service_name == "Medical Examination").branches}
              petList={petList}
              availableEmployee={availableEmployee}
              date={date}
              setDate={setDate}
              branch={branch}
              setBranch={setBranch}
              pet={pet}
              setPet={setPet}
              employee={employee}
              setEmployee={setEmployee}
            />
          ) : selectedService.service_name == "Vaccine Single Service" ? (
            <Step2UIVaccineSingle
              availableBranch={serviceList.find((service) => service.service_name == "Vaccine Single Service").branches}
              petList={petList}
              availableEmployee={availableEmployee}
              date={date}
              setDate={setDate}
              pet={pet}
              setPet={setPet}
              branch={branch}
              setBranch={setBranch}
              employee={employee}
              setEmployee={setEmployee}
              vaccine={vaccine}
              setVaccine={setVaccine}
            />
          ) : (
            <Step2UIVaccinePackage
              availableBranch={serviceList.find((service) => service.service_name == "Vaccine Package Service").branches}
              petList={petList}
              availableEmployee={availableEmployee}
              date={date}
              setDate={setDate}
              branch={branch}
              setBranch={setBranch}
              pet={pet}
              setPet={setPet}
              employee={employee}
              setEmployee={setEmployee}
              vaccinePackage={vaccinePackage}
              setVaccinePackage={setVaccinePackage}
            />
          )
        )}
        {currentStep == 3 && (
          selectedService.service_name == "Medical Examination" ? (
            <Step3UIMedicalExam
              service_name={selectedService.service_name}
              date={date}
              branch={serviceList.find((service) => service.service_name == "Medical Examination").branches.find((b) => b.branch_id == branch)?.branch_name}
              pet={petList.find((p) => p.pet_id == pet)?.pet_name}
              employee={availableEmployee.find((e) => e.employee_id == employee)?.employee_name}
            />
          ) : (selectedService.service_name == "Vaccine Single Service" ? (
            <Step3UIVaccineSingle
              service_name={selectedService.service_name}
              date={date}
              branch={serviceList.find((service) => service.service_name == "Medical Examination").branches.find((b) => b.branch_id == branch)?.branch_name}
              pet={petList.find((p) => p.pet_id == pet)?.pet_name}
              employee={availableEmployee.find((e) => e.employee_id == employee)?.employee_name}
              vaccine={vaccine}
            />
          ) : (
            <Step3UIVaccinePackage 
              service_name={selectedService.service_name}
              date={date}
              branch={serviceList.find((service) => service.service_name == "Medical Examination").branches.find((b) => b.branch_id == branch)?.branch_name}
              pet={petList.find((p) => p.pet_id == pet)?.pet_name}
              employee={availableEmployee.find((e) => e.employee_id == employee)?.employee_name}
              vaccinePackage={vaccinePackage}
            />
          ))
        )}
        {currentStep == 4 && (
          selectedService.service_name == "Medical Examination" && (<div>Booking Medical Examination...</div>)
        )}
      </div>
      <div>
        <Stepper onValueChange={setCurrentStep} value={currentStep}>
          {steps.map((step) => (
            <StepperItem className="not-last:flex-1" key={step} step={step}>
              <StepperTrigger asChild>
                <StepperIndicator />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex justify-center space-x-4 mt-10">
          <Button
            className="w-32"
            disabled={currentStep === 1}
            onClick={() => {
              setCurrentStep((prev) => prev - 1)
            }}
            variant="outline"
          >
            Prev step
          </Button>
          <Button
            className="w-32"
            disabled={currentStep > steps.length || !selectedService.service_id || !selectedService.service_name || (currentStep === 2 && (!date || !branch || !pet || !employee))}
            onClick={() => {
              setCurrentStep((prev) => prev + 1)
            }}
            variant="outline"
          >
            Next step
          </Button>
        </div>
      </div>
    </div>
  );
}
