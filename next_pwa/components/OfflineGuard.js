'use client';

import { useEffect, useState } from 'react';

export default function OfflineGuard({ children }) {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsOnline(navigator.onLine);

            const updateStatus = () => setIsOnline(navigator.onLine);
            window.addEventListener('online', updateStatus);
            window.addEventListener('offline', updateStatus);

            return () => {
                window.removeEventListener('online', updateStatus);
                window.removeEventListener('offline', updateStatus);
            };
        }
    }, []);

    return (
        <>
            {!isOnline && (
                <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 p-2 text-center text-white">
                    You are offline. Some features may be limited.
                </div>
            )}
            {children}
        </>
    );
}
