'use client';

//handles offline storage of data, indexdb use kiya hai

import { openDB } from 'idb';
import { initializePouchDB, initializeSync, stopSync } from './db';

const DB_NAME = 'walmart-edge-db'; //for offline data storage
const STORE_NAME = 'offline-data'; //cached data store ke liye

// Default online status set karo
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let offlineListeners = [];

// Sabhi listeners ko notify karne ka function
const notifyListeners = (online) => {
    if (typeof window === 'undefined') return;
    offlineListeners.forEach((listener) => listener(online));
};

// Online/offline detection initialize karo
export const initOfflineDetection = async () => {
    if (typeof window !== 'undefined') {
        // Sabse pehle PouchDB initialize karo
        await initializePouchDB();

        // Initial state set karo
        isOnline = navigator.onLine;

        // Online/offline events ke liye listeners lagao
        window.addEventListener('online', async () => {
            isOnline = true;
            console.log('App is online');
            await initializeSync(); // Online hone par sync start karo
            notifyListeners(true);
        });

        window.addEventListener('offline', () => {
            isOnline = false;
            console.log('App is offline');
            stopSync(); // Offline hone par sync band karo
            notifyListeners(false);
        });

        // Agar online hai to sync start karo
        if (isOnline) {
            await initializeSync();
        }
    }
};

// App online hai ya nahi check karo
export const checkOnlineStatus = () => {
    return typeof window !== 'undefined' ? navigator.onLine : true;
};

// Online/offline changes ke liye subscribe karo
export const subscribeToOfflineChanges = (listener) => {
    if (typeof window === 'undefined') {
        return () => { };
    }

    offlineListeners.push(listener);
    return () => {
        offlineListeners = offlineListeners.filter((l) => l !== listener);
    };
};

export async function initDB() { //db initiate kia hai
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
}

export async function saveToOfflineStorage(key, data) {
    const db = await initDB();
    await db.put(STORE_NAME, data, key);
}

export async function getFromOfflineStorage(key) {
    const db = await initDB();
    return db.get(STORE_NAME, key);
}

export async function deleteFromOfflineStorage(key) {
    const db = await initDB();
    await db.delete(STORE_NAME, key);
}

export async function clearOfflineStorage() {
    const db = await initDB();
    await db.clear(STORE_NAME);
}

export async function getAllOfflineData() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

// Function to handle API requests with offline support
export async function fetchWithOfflineSupport(url, options = {}) {
    const cacheKey = `${options.method || 'GET'}-${url}`;

    try {

        const response = await fetch(url, options);// Try to fetch from network first
        const data = await response.json();

        // Cache successful GET requests
        if (options.method === undefined || options.method === 'GET') {
            await saveToOfflineStorage(cacheKey, data);
        }

        return data;
    } catch (error) {
        // If offline, cache se uthao
        if (checkOnlineStatus() && (options.method === undefined || options.method === 'GET')) {
            const cachedData = await getFromOfflineStorage(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }
        throw error;
    }
}


export async function addToSyncQueue(transactionId, data) { // Queue to track pending sync operations
    const queueKey = `SYNC-${transactionId}`;
    await saveToOfflineStorage(queueKey, {
        data,
        timestamp: Date.now(),
        attempts: 0
    });
}

// Get all pending transactions that need to be synced
export async function getPendingSyncs() {
    const allData = await getAllOfflineData();
    return Object.entries(allData)
        .filter(([key]) => key.startsWith('SYNC-'))
        .map(([key, value]) => ({
            id: key.replace('SYNC-', ''),
            ...value
        }));
}

// Attempt to sync offline data with the server
export async function syncOfflineData(apiEndpoint) {
    if (checkOnlineStatus()) {
        const pendingSyncs = await getPendingSyncs();

        for (const item of pendingSyncs) {
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item.data)
                });

                if (response.ok) {
                    // If sync successful, remove from queue
                    await deleteFromOfflineStorage(`SYNC-${item.id}`);
                } else {
                    // Update attempt count on failure
                    await saveToOfflineStorage(`SYNC-${item.id}`, {
                        ...item,
                        attempts: (item.attempts || 0) + 1,
                        lastAttempt: Date.now()
                    });
                }
            } catch (error) {
                console.error('Sync failed for transaction:', item.id, error);
            }
        }
    }
}

// Start background sync monitoring
export function startSyncMonitoring(apiEndpoint, interval = 5 * 60 * 1000) { // 5 minutes default
    // Initial sync attempt
    syncOfflineData(apiEndpoint);


    const intervalId = setInterval(() => {// Set up periodic sync jab connection hai
        if (checkOnlineStatus()) {
            syncOfflineData(apiEndpoint);
        }
    }, interval);

    // Set up online listener for immediate sync when connection is restored
    window.addEventListener('online', () => {
        syncOfflineData(apiEndpoint);
    });

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('online', () => { });
    };
}

export default {
    initOfflineDetection,
    checkOnlineStatus,
    subscribeToOfflineChanges,
};
