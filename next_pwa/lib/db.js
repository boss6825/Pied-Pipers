'use client';

// PouchDB ke liye dynamic imports use kar rahe hai
let PouchDB = null;
let productsDB = null;
let remoteDB = null;
let syncHandler = null;
let isInitialized = false;


export const initializePouchDB = async () => {
    if (typeof window === 'undefined' || isInitialized) {
        return;
    }

    try {
        const PouchDBModule = await import('pouchdb');
        PouchDB = PouchDBModule.default;

        productsDB = new PouchDB('products');
        isInitialized = true;
        console.log('PouchDB initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize PouchDB:', error);
        return false;
    }
};

// Sync gateway URL environment se ya default use karo
const getSyncGatewayURL = () => {
    return typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_SYNC_GATEWAY_URL || 'http://localhost:4984/products')
        : '';
};

export const initializeSync = async () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        const syncGatewayURL = getSyncGatewayURL();
        remoteDB = new PouchDB(syncGatewayURL);

        // Two-way sync setup karo
        syncHandler = productsDB.sync(remoteDB, {
            live: true,
            retry: true,
        }).on('change', (change) => {
            console.log('Sync change:', change);
        }).on('error', (err) => {
            console.error('Sync error:', err);
        });

        return true;
    } catch (error) {
        console.error('Failed to initialize sync:', error);
        return false;
    }
};


export const stopSync = () => {
    if (typeof window === 'undefined' || !syncHandler) {
        return false;
    }

    syncHandler.cancel();
    syncHandler = null;
    return true;
};

// Naya product add karo database mein
export const addProduct = async (product) => {
    if (typeof window === 'undefined') {
        return { success: false, error: 'PouchDB can only be used in the browser' };
    }

    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        // Product ke liye unique ID banao
        const id = `product_${Date.now()}`;
        const productDoc = {
            _id: id,
            ...product,
            type: 'product',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await productsDB.put(productDoc);
        return { success: true, id: result.id, rev: result.rev };
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, error: error.message };
    }
};

// Saare products get karo
export const getAllProducts = async () => {
    if (typeof window === 'undefined') {
        return [];
    }

    
    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        const result = await productsDB.allDocs({
            include_docs: true,
            attachments: true,
        });

        return result.rows
            .map(row => row.doc)
            .filter(doc => doc.type === 'product');
    } catch (error) {
        console.error('Error getting all products:', error);
        return [];
    }
};

// ID se product get karo
export const getProductById = async (id) => {
    if (typeof window === 'undefined') {
        return null;
    }

    // PouchDB initialize hai ki nahi check karo
    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        const product = await productsDB.get(id);
        return product;
    } catch (error) {
        console.error(`Error getting product with ID ${id}:`, error);
        return null;
    }
};

// Product update karo
export const updateProduct = async (product) => {
    if (typeof window === 'undefined') {
        return { success: false, error: 'PouchDB can only be used in the browser' };
    }

    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        const existingProduct = await productsDB.get(product._id);

        const updatedProduct = {
            ...existingProduct,
            ...product,
            updatedAt: new Date().toISOString(),
        };

        const result = await productsDB.put(updatedProduct);
        return { success: true, id: result.id, rev: result.rev };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
};

// Product delete karo
export const deleteProduct = async (id) => {
    if (typeof window === 'undefined') {
        return { success: false, error: 'PouchDB can only be used in the browser' };
    }

    if (!isInitialized) {
        await initializePouchDB();
    }

    try {
        const product = await productsDB.get(id);
        const result = await productsDB.remove(product);
        return { success: true, id: result.id, rev: result.rev };
    } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        return { success: false, error: error.message };
    }
};

export default {
    initializePouchDB,
    initializeSync,
    stopSync,
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}; 