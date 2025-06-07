import { openDB } from 'idb';

const DB_NAME = 'walmart-edge-db';
const STORE_NAME = 'offline-data';

export async function initDB() {
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

// Function to check if we're offline
export function isOffline() {
    return typeof navigator !== 'undefined' && !navigator.onLine;
}

// Function to handle API requests with offline support
export async function fetchWithOfflineSupport(url, options = {}) {
    const cacheKey = `${options.method || 'GET'}-${url}`;

    try {
        // Try to fetch from network first
        const response = await fetch(url, options);
        const data = await response.json();

        // Cache successful GET requests
        if (options.method === undefined || options.method === 'GET') {
            await saveToOfflineStorage(cacheKey, data);
        }

        return data;
    } catch (error) {
        // If offline, try to get from cache
        if (isOffline() && (options.method === undefined || options.method === 'GET')) {
            const cachedData = await getFromOfflineStorage(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }
        throw error;
    }
}
