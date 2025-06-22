// app/layout.tsx
import Sidebar from "../components/sidebar";
import React from "react";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";



export const metadata = {
  title: "EdgeCart",
  description: "EdgeCart Admin Panel",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="min-h-screen bg-gray-50 text-black">
        <Theme>
          <div className="flex min-h-screen w-full">
            <div className="h-screen w-[250px] shrink-0 border-r-black border-gray-200 bg-white fixed">
              <Sidebar />
            </div>
            <main className="flex-1 ml-[250px] min-h-screen max-h-screen overflow-y-auto bg-gray-50 p-6">
              {children} {/* Dynamic content changes here */}
            </main>
           </div>
        </Theme>
      </body>
    </html>
  );
}
