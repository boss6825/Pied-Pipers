"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { TextField } from "@radix-ui/themes";
import { Select } from "@radix-ui/themes";
import { Badge } from "@radix-ui/themes";
import Link from "next/link";
import { initializePouchDB, getAllProducts } from "../../lib/db";
import { checkOnlineStatus } from "../../lib/offline";

// Default products to show when no products exist in the database
const defaultProducts = [
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
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set initial online status
    setIsOnline(checkOnlineStatus());
    
    // Function to load products from PouchDB
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize PouchDB first
        await initializePouchDB();
        
        // Get products from PouchDB
        const dbProducts = await getAllProducts();
        
        // If no products in DB yet, use defaults
        if (dbProducts.length === 0) {
          setProducts(defaultProducts);
        } else {
          // Map the products to match the expected format
          const formattedProducts = dbProducts.map(product => ({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.sellingPrice || product.price,
            stock: product.stock || product.initialStock,
            costPrice: product.costPrice,
            discount: product.discount,
            stockAlert: product.stockAlert,
            unit: product.unit,
            description: product.description
          }));
          
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
        // Fallback to default products if there's an error
        setProducts(defaultProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
    
    // Set up event listener for online/offline status
    const handleOnlineStatusChange = () => {
      setIsOnline(checkOnlineStatus());
      // Reload products when coming back online
      if (checkOnlineStatus()) {
        loadProducts();
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const productStatus = getStatus(p.stock).label;
    const matchStatus = status === "all" || productStatus === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your inventory and product catalog</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <TextField.Root
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-60"
        />
        <Select.Root value={category} onValueChange={setCategory}>
          <Select.Trigger placeholder="All Categories" />
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            <Select.Item value="Electronics">Electronics</Select.Item>
            <Select.Item value="Food & Beverage">Food & Beverage</Select.Item>
            <Select.Item value="Stationery">Stationery</Select.Item>
            <Select.Item value="Home & Office">Home & Office</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root value={status} onValueChange={setStatus}>
          <Select.Trigger placeholder="All Statuses" />
          <Select.Content>
            <Select.Item value="all">All Statuses</Select.Item>
            <Select.Item value="In Stock">In Stock</Select.Item>
            <Select.Item value="Low Stock">Low Stock</Select.Item>
            <Select.Item value="Out of Stock">Out of Stock</Select.Item>
          </Select.Content>
        </Select.Root>
        <Button variant="secondary" onClick={() => { setSearch(""); setCategory("all"); setStatus("all"); }}>Clear Filters</Button>
        <div className="ml-auto flex gap-2">
          <Button><Link href="/addProducts">Add Product</Link></Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-white">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or add new products.</p>
          <Button className="mt-4"><Link href="/addProducts">Add Product</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const status = getStatus(product.stock);
            return (
              <div key={product._id || product.sku} className="border rounded-xl p-4 bg-white space-y-3 shadow-sm">
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
      )}
    </div>
  );
}
