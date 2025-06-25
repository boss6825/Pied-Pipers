// app/layout.js
import Sidebar from "../components/sidebar";
import React from "react";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import ClientLayout from "./ClientLayout";

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
          <ClientLayout>
            {children}
          </ClientLayout>
        </Theme>
      </body>
    </html>
  );
}
