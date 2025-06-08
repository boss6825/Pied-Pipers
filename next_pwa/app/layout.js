// app/layout.tsx
import Sidebar from "../components/sidebar";
import React from "react";
import "./globals.css";

export const metadata = {
  title: "RetailHub",
  description: "RetailHub Admin Panel",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar /> {/* Persistent */}
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          {children} {/* Dynamic content changes here */}
        </main>
      </body>
    </html>
  );
}
