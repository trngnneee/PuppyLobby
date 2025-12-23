import { formatDateReverse } from "@/utils/date";
import { toast } from "sonner";

export const handleSubmit = async (event, {
  customerInfo,
  newPetCreate,
  petInfo,
  targetPet,
  targetServiceInfo,
  router
}) => {
  event.preventDefault();
  
  let customer_id = null;
  // Khách hàng chưa tồn tại, tạo mới khách hàng
  if (!customerInfo.customerID) {
    if (!customerInfo.customerName || !customerInfo.phoneNumber || !customerInfo.citizenID) {
      toast.error("Please fill in all customer information.");
      return;
    }
    const newCustomer = {
      customer_name: customerInfo.customerName,
      phone_number: customerInfo.phoneNumber,
      cccd: customerInfo.citizenID
    };
    const promise = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCustomer)
    });
    const data = await promise.json();
    if (data.code == "success") {
      customer_id = data.customer_id;
    }
    else {
      toast.error(data.message);
    }
  }
  else {
    customer_id = customerInfo.customerID;
  }

  // Nếu khách hàng đã có pet thì lấy pet_id từ targetPet
  let pet_id = null;
  if (targetPet && !newPetCreate) {
    pet_id = targetPet;
  }
  // Nếu khách hàng chưa có pet hoặc tạo mới pet thì tạo mới pet
  else {
    if (!petInfo.name || !petInfo.species || !petInfo.breed || !petInfo.age) {
      toast.error("Please fill in all pet information.");
      return;
    }
    const newPet = {
      pet_name: petInfo.name,
      species: petInfo.species,
      breed: petInfo.breed,
      age: petInfo.age,
      gender: petInfo.gender,
      health_status: petInfo.healthStatus,
      customer_id: customer_id
    };
    const promise = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pet/create/onsite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPet)
    });
    const data = await promise.json();
    if (data.code == "success") {
      pet_id = data.pet_id;
    }
    else {
      toast.error(data.message);
      return;
    }
  }

  if (!targetServiceInfo.service_id || !targetServiceInfo.date || !targetServiceInfo.branch || !targetServiceInfo.employee) {
    toast.error("Please fill in all service information.");
    return;
  }
  if (targetServiceInfo.service_name === "Medical Examination") {
    const newService = {
      date: formatDateReverse(targetServiceInfo.date),
      service_id: targetServiceInfo.service_id,
      branch_id: targetServiceInfo.branch,
      pet_id: pet_id,
      employee_id: targetServiceInfo.employee,
      customer_id: customer_id
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/onsite/medical-examination/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newService)
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    toast.promise(promise, {
      loading: "Creating onsite medical examination service...",
      success: (data) => {
        if (data.code === "success") {
          router.push("/");
          return "Onsite medical examination service created successfully!";
        }
        else {
          return `Error: ${data.message}`;
        }
      },
      error: "Failed to create onsite medical examination service."
    })
  }
  if (targetServiceInfo.service_name === "Vaccine Single Service") {
    const newService = {
      date: formatDateReverse(targetServiceInfo.date),
      service_id: targetServiceInfo.service_id,
      branch_id: targetServiceInfo.branch,
      pet_id: pet_id,
      employee_id: targetServiceInfo.employee,
      customer_id: customer_id,
      vaccine_id: targetServiceInfo.vaccine
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/onsite/vaccine-single/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newService)
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    toast.promise(promise, {
      loading: "Creating onsite vaccine single service...",
      success: (data) => {
        if (data.code === "success") {
          router.push("/");
          return "Onsite vaccine single service created successfully!";
        }
        else {
          return `Error: ${data.message}`;
        }
      },
      error: "Failed to create onsite vaccine single service."
    })
  }
  if (targetServiceInfo.service_name === "Vaccine Package Service") {
    const newService = {
      date: formatDateReverse(targetServiceInfo.date),
      service_id: targetServiceInfo.service_id,
      branch_id: targetServiceInfo.branch,
      pet_id: pet_id,
      employee_id: targetServiceInfo.employee,
      customer_id: customer_id,
      package_id: targetServiceInfo.vaccinePackage
    };
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/service/onsite/vaccine-package/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newService)
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    toast.promise(promise, {
      loading: "Creating onsite vaccine package service...",
      success: (data) => {
        if (data.code === "success") {
          router.push("/");
          return "Onsite vaccine package service created successfully!";
        }
        else {
          return `Error: ${data.message}`;
        }
      },
      error: "Failed to create onsite vaccine package service."
    })
  }
}