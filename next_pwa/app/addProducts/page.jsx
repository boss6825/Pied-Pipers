"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { TextField } from "@radix-ui/themes";
import { Controller } from "react-hook-form";
import { Select } from "@radix-ui/themes";



const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.enum(["Electronics","Food & Beverage","Stationery","Home & Office"]),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  initialStock: z.number().min(0),
  stockAlert: z.number().min(0).optional(),
  unit: z.enum(["pcs", "kg", "liters", "boxes", "meter"]).optional(),
  description: z.string().optional(),
});

export default function AddProductPage() {
  const {form, handleSubmit, register, control} = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", sku: "", category: "", price: 0, description: "" }
  });

  const onSubmit = (data) => {
    console.log("Submit:", data);

  const existing = JSON.parse(localStorage.getItem("products") || "[]");
  const formatted = {
    name: data.name,
    sku: data.sku,
    category: data.category,
    price: data.sellingPrice,
    stock: data.initialStock,
  };
  localStorage.setItem("products", JSON.stringify([...existing, formatted]));
  alert("Product saved!");
  
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      <form className="p-4 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row gap-20 w-full mb-4">
            <div className="w-1/2">
                <label htmlFor="name">Product Name*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Product Name"
                    className="mb-3 mt-2"
                    {...register("name")}
                ></TextField.Root>
            </div>
            <div className="w-1/2">
                <label htmlFor="sku">SKU*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter SKU code"
                    className="mb-3 mt-2"
                    {...register("sku")}
                ></TextField.Root>
            </div>
        </div>
        <div className="w-full">
            <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="mb-3">
              <label htmlFor="category" className="mr-5">Category*</label>
              <Select.Root
                size="3"
                defaultValue="Electronics"
                onValueChange={field.onChange}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="Electronics">Electronics</Select.Item>
                  <Select.Item value="Food & Beverage">Food & Beverage</Select.Item>
                  <Select.Item value="Stationery">Stationery</Select.Item>
                  <Select.Item value="Home & Office">Home & Office</Select.Item>
                </Select.Content>
              </Select.Root>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row gap-20 w-full mb-4">
            <div className="w-1/2">
                <label htmlFor="costPrice">Cost Price*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Cost Price"
                    type="number"
                    className="mb-3 mt-2"
                    {...register("costPrice", { valueAsNumber: true })}
                ></TextField.Root>
            </div>
            <div className="w-1/2">
                <label htmlFor="sellingPrice">Selling Price*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Selling Price"
                    type="number"
                    className="mb-3 mt-2"
                    {...register("sellingPrice", { valueAsNumber: true })}
                ></TextField.Root>
            </div>
        </div>
        <div className="flex flex-row gap-20 w-full mb-4">
            <div className="w-1/2">
                <label htmlFor="discount">Discount (%)</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Discount"
                    type="number"
                    className="mb-3 mt-2"
                    {...register("discount", { valueAsNumber: true })}
                ></TextField.Root>
            </div>
            <div className="w-1/2">
                <label htmlFor="initialStock">Initial Stock*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Initial Stock"
                    type="number"
                    className="mb-3 mt-2"
                    {...register("initialStock", { valueAsNumber: true })}
                ></TextField.Root>
            </div>
            </div>
        <div className="flex flex-row gap-20 w-full mb-4">
            <div className="w-1/2">
                <label htmlFor="stockAlert">Stock Alert</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter Stock Alert Level"
                    type="number"
                    className="mb-3 mt-2"
                    {...register("stockAlert", { valueAsNumber: true })}
                ></TextField.Root>
            </div>
            <div className="w-1/2">
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-3">
                      <label htmlFor="unit" className="mr-5">Unit</label>
                      <Select.Root
                        size="3"
                        defaultValue="pcs"
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="pcs">pcs</Select.Item>
                          <Select.Item value="kg">kg</Select.Item>
                          <Select.Item value="liters">liters</Select.Item>
                          <Select.Item value="boxes">boxes</Select.Item>
                          <Select.Item value="meter">meter</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  )}
                />
            </div>
        </div>
        <div className="w-full mb-4">
            <label htmlFor="description">Description</label>
            <TextField.Root
                size="3"
                placeholder="Enter Product Description"
                className="mb-3 mt-2"
                {...register("description")}
            ></TextField.Root>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
    
  )
}