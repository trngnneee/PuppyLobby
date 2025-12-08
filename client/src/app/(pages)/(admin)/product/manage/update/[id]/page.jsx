"use client"

import { FileUploader } from "@/app/(pages)/components/FileUploader";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductUpdatePage() {
  const [type, setType] = useState("medicine");
  const [manufactureDate, setManufactureDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const [species, setSpecies] = useState("dog");
  const [submit, setSubmit] = useState(false);
  const { id } = useParams();
  const [imageList, setImageList] = useState([]);
  const router = useRouter();

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

  const [productDetail, setProductDetail] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            setProductDetail(data.productDetail);
            setManufactureDate(new Date(data.productDetail.manufacture_date));
            setEntryDate(new Date(data.productDetail.entry_date));
            setExpireDate(new Date(data.productDetail.expiry_date));
            setType(data.productDetail.type);
            setSpecies(data.productDetail.species || "dog");
            const images = (data.productDetail.images || []).map((url, index) => ({
              name: `image-${index + 1}.jpg`,
              size: 0,
              type: "image/jpeg",
              url,
              id: `image-${index}-${Date.now()}`
            }));
            setImageList(images);

            setLoaded(true);
          }
        })
    }
    fetchData();
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submit) {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("name", e.target['name'].value);
      formData.append("price", e.target['price'].value);
      formData.append("manufacture_date", manufactureDate.toISOString().split('T')[0]);
      formData.append("entry_date", entryDate.toISOString().split('T')[0]);
      formData.append("expiry_date", expireDate.toISOString().split('T')[0]);
      formData.append("stock", e.target['stock'].value);
      if (type == "medicine") {
        formData.append("species", species);
        formData.append("dosage_use", e.target['dosage-use'].value);
        formData.append("side_effect", e.target['side-effect'].value);
      }
      if (type == "food") {
        formData.append("species", species);
        formData.append("weight", e.target['weight'].value);
        formData.append("nutrition_description", e.target['nutrition-description'].value);
      }
      if (type == "accessory") {
        formData.append("size", e.target['size'].value);
        formData.append("color", e.target['color'].value);
        formData.append("material", e.target['material'].value);
      }

      const normalizedList = imageList.map((img) => {
        if (img instanceof File) {
          return {
            id: `${img.name}-${Date.now()}`,
            name: img.name,
            size: img.size,
            type: img.type,
            url: URL.createObjectURL(img),
            file: img,
          };
        }
        return img;
      });

      const existingImages = normalizedList.filter((img) => img.url && !img.file);
      const existingUrls = existingImages.map((img) => img.url);
      formData.append("existingFiles", JSON.stringify(existingUrls));

      const newImages = normalizedList.filter((img) => img.file);
      newImages.forEach((img) => {
        formData.append("files", img.file);
      });

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/update/${id}`, {
        method: "POST",
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })

      toast.promise(promise, {
        loading: 'Updating product...',
        success: (data) => {
          if (data.code == "success") {
            setTimeout(() => {
              router.push("/product/manage");
            }, 1000);
            return 'Product updated successfully';
          }
        },
        error: 'Error updating product',
      })
    }
  }

  return (
    <>
      <SectionHeader title={`Update Product ${productDetail ? productDetail.product_name : ''}`} />
      <form className="mt-[30px]" id="productCreateForm" onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-10">
            <div className="w-full">
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-[var(--main)]">Choose a product type</Label>
                <Input
                  type="text"
                  id="type"
                  name="type"
                  value={type}
                  readOnly
                  className={"capitalize"}
                />
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
                  defaultValue={productDetail ? productDetail.product_name : ''}
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
                  defaultValue={productDetail ? productDetail.price : ''}
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
              <div className="mb-[15px] *:not-first:mt-2">
                <Label htmlFor="stock" className="text-sm font-medium text-[var(--main)]">Stock</Label>
                <Input
                  type="number"
                  min="0"
                  id="stock"
                  name="stock"
                  defaultValue={productDetail ? productDetail.stock : ''}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          {loaded && (
            <FileUploader
              value={imageList.length > 0 ? imageList : []}
              onChange={setImageList}
            />
          )}
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
                      defaultValue={productDetail ? productDetail.dosage_use : ''}
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
                      defaultValue={productDetail ? productDetail.side_effect : ''}
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
                      defaultValue={productDetail ? productDetail.weight : ''}
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
                      defaultValue={productDetail ? productDetail.nutrition_description : ''}
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
                      defaultValue={productDetail ? productDetail.size : ''}
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
                      defaultValue={productDetail ? productDetail.color : ''}
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
                      defaultValue={productDetail ? productDetail.material : ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <Button disabled={submit} className="bg-[var(--main)] hover:bg-[var(--main-hover)] text-white w-full mt-[50px]">Save</Button>
      </form>
    </>
  )
}