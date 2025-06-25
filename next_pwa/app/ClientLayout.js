"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import OfflineGuard from "../components/OfflineGuard";
import { initOfflineDetection } from "../lib/offline";

export default function ClientLayout({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize offline detection and sync
    useEffect(() => {
        const initialize = async () => {
            try {
                await initOfflineDetection();

                // Register service worker for PWA functionality
                if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                    navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                            console.log('Service Worker registered:', registration);
                        })
                        .catch((error) => {
                            console.log('Service Worker registration failed:', error);
                        });
                }

                setIsInitialized(true);
            } catch (error) {
                console.error("Failed to initialize offline detection:", error);
            }
        };

        initialize();
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            <div className="h-screen w-[250px] shrink-0 border-r-black border-gray-200 bg-white fixed">
                <Sidebar />
            </div>
            <main className="flex-1 ml-[250px] min-h-screen max-h-screen overflow-y-auto bg-gray-50 p-6">
                <OfflineGuard />
                {children} {/* Dynamic content changes here */}
            </main>
        </div>
    );
} 