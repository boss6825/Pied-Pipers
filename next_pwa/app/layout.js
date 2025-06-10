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
      <body className="h-full w-full overflow-hidden bg-gray-50 text-black">
        <Theme>
          <div className="flex h-full w-full">
            <Sidebar /> {/* Persistent */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children} {/* Dynamic content changes here */}
            </main>
           </div>
        </Theme>
      </body>
    </html>
  );
}
