"use client";

import React, { useState, useEffect } from 'react';
import { checkOnlineStatus, subscribeToOfflineChanges } from '../lib/offline';

const OfflineGuard = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Set initial online status
        setIsOnline(checkOnlineStatus());

        // Subscribe to online/offline changes
        const unsubscribe = subscribeToOfflineChanges((online) => {
            setIsOnline(online);
            setShowBanner(true);

            // Hide the banner after 3 seconds
            setTimeout(() => {
                setShowBanner(false);
            }, 3000);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-md transition-all duration-300 ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {isOnline ? (
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Online - Syncing data</span>
                </div>
            ) : (
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span>Offline - Changes will sync when online</span>
                </div>
            )}
        </div>
    );
};

export default OfflineGuard;
