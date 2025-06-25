"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useEffect } from "react";
import { TextField } from "@radix-ui/themes";
import { Controller } from "react-hook-form";
import { Select } from "@radix-ui/themes";
import { initializePouchDB, addProduct } from "../../lib/db";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        
        await initializePouchDB();
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize PouchDB:", error);
        setSubmitResult({
          type: 'error',
          message: 'Failed to initialize database. Please try again later.'
        });
      }
    };
    
    initialize();
  }, []);
  
  const {
    handleSubmit, 
    register, 
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { 
      name: "", 
      sku: "", 
      category: "Electronics", 
      costPrice: 0, 
      sellingPrice: 0,
      discount: 0,
      initialStock: 0,
      stockAlert: 0,
      unit: "pcs",
      description: "" 
    }
  });

  const onSubmit = async (data) => {
    if (!isInitialized) {
      setSubmitResult({
        type: 'error',
        message: 'Database not initialized. Please try again later.'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Product data format karo
      const productData = {
        name: data.name,
        sku: data.sku,
        category: data.category,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        discount: data.discount || 0,
        stock: data.initialStock,
        stockAlert: data.stockAlert || 0,
        unit: data.unit || "pcs",
        description: data.description || "",
      };
      
      // Product ko PouchDB mein add karo
      const result = await addProduct(productData);
      
      if (result.success) {
        setSubmitResult({
          type: 'success',
          message: 'Product saved successfully!'
        });
        reset(); // Form reset karo
      } else {
        setSubmitResult({
          type: 'error',
          message: `Failed to save product: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitResult({
        type: 'error',
        message: `An unexpected error occurred: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
      
      // 3 seconds baad message gayab kar do
      setTimeout(() => {
        setSubmitResult(null);
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      
      {/* Result notification */}
      {submitResult && (
        <div className={`mb-4 p-3 rounded ${
          submitResult.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {submitResult.message}
        </div>
      )}
      
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
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="w-1/2">
                <label htmlFor="sku">SKU*</label>
                <TextField.Root
                    size="3"
                    placeholder="Enter SKU code"
                    className="mb-3 mt-2"
                    {...register("sku")}
                ></TextField.Root>
                {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
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
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
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
                {errors.costPrice && <p className="text-red-500 text-sm">{errors.costPrice.message}</p>}
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
                {errors.sellingPrice && <p className="text-red-500 text-sm">{errors.sellingPrice.message}</p>}
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
                {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
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
                {errors.initialStock && <p className="text-red-500 text-sm">{errors.initialStock.message}</p>}
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
                {errors.stockAlert && <p className="text-red-500 text-sm">{errors.stockAlert.message}</p>}
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
                      {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
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
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isInitialized}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
              (isSubmitting || !isInitialized) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Adding Product...' : !isInitialized ? 'Initializing...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
    
  )
}