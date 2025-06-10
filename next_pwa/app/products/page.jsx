"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { TextField } from "@radix-ui/themes";
import { Select } from "@radix-ui/themes";
import { Badge } from "@radix-ui/themes";

const products = [
  {
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 89.99,
    stock: 45,
  },
  {
    name: "Coffee Beans",
    sku: "CB-002",
    category: "Food & Beverage",
    price: 24.99,
    stock: 8,
  },
  {
    name: "Notebook Set",
    sku: "NB-003",
    category: "Stationery",
    price: 2.99,
    stock: 120,
  },
  {
    name: "Desk Lamp",
    sku: "DL-004",
    category: "Home & Office",
    price: 45.99,
    stock: 0,
  },
];

function getStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", color: "red" };
  if (stock < 10) return { label: "Low Stock", color: "yellow" };
  return { label: "In Stock", color: "green" };
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "" || p.category === category;
    const productStatus = getStatus(p.stock).label;
    const matchStatus = status === "" || productStatus === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your inventory and product catalog</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <TextField.Root
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60"
        />
        <Select.Root defaultValue="Electronics" onValueChange={setCategory}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="Electronics">Electronics</Select.Item>
            <Select.Item value="Food & Beverage">Food & Beverage</Select.Item>
            <Select.Item value="Stationery">Stationery</Select.Item>
            <Select.Item value="Home & Office">Home & Office</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="In Stock" onValueChange={setStatus}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="In Stock">In Stock</Select.Item>
            <Select.Item value="Low Stock">Low Stock</Select.Item>
            <Select.Item value="Out of Stock">Out of Stock</Select.Item>
          </Select.Content>
        </Select.Root>
        <Button variant="secondary" onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}>Clear Filters</Button>
        <div className="ml-auto flex gap-2">
          <Button>Add Product</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => {
          const status = getStatus(product.stock);
          return (
            <div key={product.sku} className="border rounded-xl p-4 bg-white space-y-3 shadow-sm">
              <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Image</span>
              </div>
              <div>
                <h2 className="font-semibold leading-tight">{product.name}</h2>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">${product.price}</span>
                <Badge color={status.color}>{status.label}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
              <div className="flex gap-2">
                <Button size="sm">View Details</Button>
                <Button variant="outline" size="sm">Restock</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
