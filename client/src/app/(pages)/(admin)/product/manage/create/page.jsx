"use client"

import { SectionHeader } from "@/app/(pages)/me/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { speciesOptions } from "@/config/variable.config";
import { formatDate } from "@/utils/date";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";

export default function ProductCreatePage() {
  const [type, setType] = useState("medicine");
  const [manufactureDate, setManufactureDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const [species, setSpecies] = useState("dog");
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const validation = new JustValidate('#productCreateForm');

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
      .addField('#price', [
        {
          rule: 'required',
          errorMessage: 'Price is required',
        },
        {
          rule: 'number',
          errorMessage: 'Price must be a number',
        },
      ]);

    if (type == "medicine") {
      validation.addField('#dosage-use', [
        {
          rule: 'required',
          errorMessage: 'Dosage use is required',
        },
      ])
        .addField('#side-effect', [
          {
            rule: 'required',
            errorMessage: 'Side effect is required',
          },
        ]);
    }
    if (type == "food") {
      validation.addField('#weight', [
        {
          rule: 'required',
          errorMessage: 'Weight is required',
        },
        {
          rule: 'number',
          errorMessage: 'Weight must be a number',
        },
      ])
        .addField('#nutrition-description', [
          {
            rule: 'required',
            errorMessage: 'Nutrition description is required',
          },
        ]);
    }

    if (type == "accessory") {
      validation.addField('#size', [
        {
          rule: 'required',
          errorMessage: 'Size is required',
        },
      ])
        .addField('#color', [
          {
            rule: 'required',
            errorMessage: 'Color is required',
          },
        ])
        .addField('#material', [
          {
            rule: 'required',
            errorMessage: 'Material is required',
          },
        ]);
    }

    validation.onSuccess(() => {
      setSubmit(true);
    });
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit)
    {
      const name = e.target.name.value;
      const price = e.target.price.value;
      console.log({ name, price, manufactureDate, entryDate, expireDate });
      console.log(type);
      if (type == "medicine") {
        const dosageUse = e.target["dosage-use"].value;
        const sideEffect = e.target["side-effect"].value;
        console.log({ species, dosageUse, sideEffect });
      }
      if (type == "food") {
        const weight = e.target["weight"].value;
        const nutritionDescription = e.target["nutrition-description"].value;
        console.log({ species, weight, nutritionDescription });
      }
      if (type == "accessory") {
        const size = e.target["size"].value;
        const color = e.target["color"].value;
        const material = e.target["material"].value;
        console.log({ size, color, material });
      }
    }
  }
  
  return (
    <>
      <SectionHeader title="Add new Product" />
      <form className="mt-[30px]" id="productCreateForm" onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)]">Choose a product type</Label>
                <Select defaultValue={type} onValueChange={setType}>
                  <SelectTrigger id="productType">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
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
                <Label htmlFor="price" className="text-sm font-medium text-[var(--main)]">Price</Label>
                <Input
                  type="number"
                  min="0"
                  id="price"
                  name="price"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="manufacture_date" className="text-sm font-medium text-[var(--main)]">Manufacture date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="manufacture_date"
                      name="manufacture_date"
                      value={formatDate(manufactureDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={manufactureDate}
                      onSelect={setManufactureDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="entry_date" className="text-sm font-medium text-[var(--main)]">Entry date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="entry_date"
                      name="entry_date"
                      value={formatDate(entryDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={entryDate}
                      onSelect={setEntryDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="expire_date" className="text-sm font-medium text-[var(--main)]">Expire date</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Input
                      type="text"
                      id="expire_date"
                      name="expire_date"
                      value={formatDate(expireDate)}
                      readOnly
                      className="cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Calendar
                      mode="single"
                      selected={expireDate}
                      onSelect={setExpireDate}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full">

            </div>
          </div>
        </div>
        {type == "medicine" ? (
          <>
            <div className="mt-5">
              <div className="flex gap-10">
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
                    <Label htmlFor="dosage-use" className="text-sm font-medium text-[var(--main)]">Dosage use</Label>
                    <Input
                      type="text"
                      id="dosage-use"
                      name="dosage-use"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="side-effect" className="text-sm font-medium text-[var(--main)]">Side effect</Label>
                    <Input
                      type="text"
                      id="side-effect"
                      name="side-effect"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : type == "food" ? (
          <>
            <div className="mt-5">
              <div className="flex gap-10">
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
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="weight" className="text-sm font-medium text-[var(--main)]">Weight</Label>
                    <Input
                      type="number"
                      min="0"
                      id="weight"
                      name="weight"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex gap-10">
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="nutrition-description" className="text-sm font-medium text-[var(--main)]">Nutrition Description</Label>
                    <Textarea
                      type="text"
                      id="nutrition-description"
                      name="nutrition-description"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-5">
              <div className="flex gap-10">
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="size" className="text-sm font-medium text-[var(--main)]">Size</Label>
                    <Input
                      type="text"
                      id="size"
                      name="size"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="color" className="text-sm font-medium text-[var(--main)]">Color</Label>
                    <Input
                      type="text"
                      id="color"
                      name="color"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="mb-[15px] *:not-first:mt-2">
                    <Label htmlFor="material" className="text-sm font-medium text-[var(--main)]">Material</Label>
                    <Input
                      type="text"
                      id="material"
                      name="material"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Create</Button>
      </form>
    </>
  )
}