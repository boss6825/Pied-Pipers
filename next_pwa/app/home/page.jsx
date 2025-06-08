'use client';
import React from 'react';

import {
  ArrowUpRight,
  ArrowDownRight,
  Home,
  AlertCircle,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="text-xl font-bold text-black">1,247</h2>
            </div>
            <div className="bg-blue-100 text-blue-600 p-2 rounded">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h2 className="text-xl font-bold text-red-600">23</h2>
            </div>
            <div className="bg-red-100 text-red-600 p-2 rounded">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">Needs attention</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="text-xl font-bold text-black">$24,567</h2>
            </div>
            <div className="bg-green-100 text-green-600 p-2 rounded">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +8.2% from last month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <h2 className="text-xl font-bold text-black">89</h2>
            </div>
            <div className="bg-purple-100 text-purple-600 p-2 rounded">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +15% from yesterday
          </p>
        </div>
      </div>

      {/* Placeholder for Sales Overview and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <div className="flex justify-between mb-2">
            <h2 className="font-semibold text-black">Sales Overview</h2>
            <select className="text-black bg-white border px-2 py-1 rounded">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            {/* You can integrate recharts or chart.js here */}
            [Chart Placeholder]
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-black">Top Selling Products</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className='text-black'>Wireless Headphones</span>
              <span className="text-green-600">+12%</span>
            </li>
            <li className="flex justify-between">
              <span className='text-black'>Coffee Beans</span>
              <span className="text-green-600">+8%</span>
            </li>
            <li className="flex justify-between">
              <span className='text-black'>Notebook Set</span>
              <span className="text-red-600">-3%</span>
            </li>
            <li className="flex justify-between">
              <span className='text-black'>Desk Lamp</span>
              <span className="text-green-600">+5%</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-black">Recent Activity</h2>
          <a href="#" className="text-blue-600 text-sm">View all</a>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          <li>🟢 New product "Smart Watch Pro" added to inventory - 2 minutes ago</li>
          <li>🔵 Order #1234 completed and shipped - 5 minutes ago</li>
        </ul>
      </div>
    </div>
  );
}
