"use client"

import { Label } from "@/components/ui/label";
import { SectionHeader } from "../../../components/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { healthStatusOptions, speciesOptions } from "@/config/variable.config";
import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreatePetPage() {
  const [submit, setSubmit] = useState(false);
  const [species, setSpecies] = useState('dog');
  const [gender, setGender] = useState('male');
  const [healthStatus, setHealthStatus] = useState('healthy');
  const { id } = useParams();
  const router = useRouter();

  const [petDetail, setPetDetail] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pet/detail/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success")
          {
            setPetDetail(data.petDetail);
            setGender(data.petDetail.gender);
            setSpecies(data.petDetail.species);
            setHealthStatus(data.petDetail.health_state);
          }
        })
    };
    fetchData();
  }, []); 

  useEffect(() => {
    const validation = new JustValidate('#petCreateForm');
    validation.addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Name is required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Name must be at least 2 characters',
      },
      {
        rule: 'maxLength',
        value: 100,
        errorMessage: 'Name cannot exceed 100 characters',
      },
    ])
      .addField('#breed', [
        {
          rule: 'required',
          errorMessage: 'Breed is required',
        },
      ])
      .addField('#age', [
        {
          rule: 'required',
          errorMessage: 'Age is required',
        },
        {
          rule: 'number',
          errorMessage: 'Age must be a number',
        },
        {
          rule: 'minNumber',
          value: 0,
          errorMessage: 'Age must be at least 0',
        },
        {
          rule: 'maxNumber',
          value: 100,
          errorMessage: 'Age must be less than 100',
        },
      ])
      .onSuccess(() => {
        setSubmit(true);
      });
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const name = e.target.name.value;
      const breed = e.target.breed.value;
      const age = e.target.age.value;

      const finalData = {
        pet_name: name,
        species: species,
        breed: breed,
        age: age,
        gender: gender,
        health_state: healthStatus,
      };

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/pet/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {return data});

      toast.promise(promise, {
        loading: 'Updating pet...',
        success: (data) => {
          if (data.code == "success")
          {
            router.push('/me/pets');
            return data.message;
          }
        },
        error: (data) => data.message
      })
    }
  }

  return (
    <>
      <SectionHeader title="Update Pet" />
      <form className="" id="petCreateForm" onSubmit={handleSubmit}>
        <div className="mt-[30px]">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="name" className="text-sm font-medium text-[var(--main)]">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={petDetail?.pet_name}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="species" className="text-sm font-medium text-[var(--main)]">Species</Label>
                <Select value={species} onValueChange={setSpecies}>
                  <SelectTrigger id="species">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="breed" className="text-sm font-medium text-[var(--main)]">Breed</Label>
                <Input
                  type="text"
                  id="breed"
                  name="breed"
                  defaultValue={petDetail?.breed}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="age" className="text-sm font-medium text-[var(--main)]">Age</Label>
                <Input
                  type="number"
                  min={0}
                  id="age"
                  name="age"
                  defaultValue={petDetail?.age}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full mb-[15px] *:not-first:mt-2">
              <Label htmlFor="gender" className="text-sm font-medium text-[var(--main)]">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="healthStatus" className="text-sm font-medium text-[var(--main)]">Health status</Label>
                <Select value={healthStatus} onValueChange={setHealthStatus}>
                  <SelectTrigger id="healthStatus">
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthStatusOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}