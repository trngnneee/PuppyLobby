"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { healthStatusOptions, speciesOptions } from "@/config/variable.config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export const NoneExistUserUI = ({
  petInfo,
  setPetInfo,
}) => {
  return (
    <>
      <div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="name" className="text-sm font-medium text-[var(--main)]">Pet Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={petInfo.name}
                  onChange={(e) => setPetInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="species" className="text-sm font-medium text-[var(--main)]">Species</Label>
                <Select defaultValue="dog" onValueChange={(value) => setPetInfo(prev => ({ ...prev, species: value }))}>
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
                  value={petInfo.breed}
                  onChange={(e) => setPetInfo(prev => ({ ...prev, breed: e.target.value }))}
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
                  value={petInfo.age}
                  onChange={(e) => setPetInfo(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full mb-[15px] *:not-first:mt-2">
              <Label htmlFor="gender" className="text-sm font-medium text-[var(--main)]">Gender</Label>
              <Select defaultValue="male" onValueChange={(value) => setPetInfo(prev => ({ ...prev, gender: value }))}>
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
                <Select defaultValue="healthy" onValueChange={(value => setPetInfo(prev => ({ ...prev, healthStatus: value })))}>
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
      </div>
    </>
  )
}