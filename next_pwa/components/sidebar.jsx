// components/Sidebar.tsx
"use client";

import {
  LayoutDashboard,
  Package,
  Plus,
  CheckCircle,
  Grid,
  Search,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const currentPath = usePathname();
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/home" },
    { name: "Products", icon: <Package size={18} />, href: "/products" },
    { name: "Add Product", icon: <Plus size={18} />, href: "/addProducts" },
    { name: "Product Details", icon: <CheckCircle size={18} />, href: "/productDetails" },
    { name: "Inventory", icon: <Grid size={18} />, href: "/inventory" },
    { name: "Search", icon: <Search size={18} />, href: "/search" },
    { name: "Analytics", icon: <BarChart size={18} />, href: "/analytics" },
    { name: "Settings", icon: <Settings size={18} />, href: "/settings" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">
      <div>
        <div className="p-6 font-bold text-xl flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded">
            <LayoutDashboard />
          </div>
          <span className="text-black">EdgeCart</span>
        </div>
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => (
            <Link
            href={item.href}
              key={item.name}
              className={`flex items-center space-x-3 py-2 px-3 rounded-md text-sm text-gray-700 cursor-pointer ${currentPath === item.href ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
            >
              <span className="w-5">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t flex items-center space-x-3">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Pipers</p>
          <p className="text-xs text-gray-500">pipers@retailhub.com</p>
        </div>
        <LogOut className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
};

export default Sidebar;
