"use client"

import { Label } from "@/components/ui/label";
import { SectionHeader } from "../../components/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { healthStatusOptions, speciesOptions } from "@/config/variable.config";
import { useEffect, useState } from "react";
import JustValidate from "just-validate";

export default function CreatePetPage() {
  const [submit, setSubmit] = useState(false);
  const [species, setSpecies] = useState('dog');
  const [gender, setGender] = useState('male');
  const [healthStatus, setHealthStatus] = useState('healthy');

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

      console.log({ name, species, breed, age, gender, healthStatus });
    }
  }

  return (
    <>
      <SectionHeader title="Add new Pet" />
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
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="species" className="text-sm font-medium text-[var(--main)]">Species</Label>
                <Select defaultValue="dog" onValueChange={setSpecies}>
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
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full mb-[15px] *:not-first:mt-2">
              <Label htmlFor="gender" className="text-sm font-medium text-[var(--main)]">Gender</Label>
              <Select defaultValue="male" onValueChange={setGender}>
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
                <Select defaultValue="healthy" onValueChange={setHealthStatus}>
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
        <Button className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Create</Button>
      </form>
    </>
  )
}