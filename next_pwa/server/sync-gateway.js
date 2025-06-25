// This is a placeholder for a Couchbase Sync Gateway server
// In a real implementation, you would use the actual Couchbase Sync Gateway

const express = require('express');
const cors = require('cors');
const PouchDB = require('pouchdb');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4984;


app.use(cors());
app.use(express.json());

// Create a directory for the server databases if it doesn't exist
const DB_DIR = path.join(__dirname, 'databases');
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Add PouchDB plugins
PouchDB.plugin(require('pouchdb-find'));


const productsDB = new PouchDB(path.join(DB_DIR, 'products'));

// In a real implementation, you would connect to Couchbase Server
// For example:
// const couchbaseConnection = new CouchbaseServer({
//   url: process.env.COUCHBASE_URL || 'couchbase://localhost',
//   username: process.env.COUCHBASE_USERNAME || 'Administrator',
//   password: process.env.COUCHBASE_PASSWORD || 'password'
// });

// Routes for products
app.get('/products', async (req, res) => {
    try {
        const result = await productsDB.allDocs({
            include_docs: true,
            attachments: true
        });

        const products = result.rows.map(row => row.doc);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await productsDB.get(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(`Error fetching product ${req.params.id}:`, error);
        res.status(404).json({ error: 'Product not found' });
    }
});

app.post('/products', async (req, res) => {
    try {
        const result = await productsDB.put({
            _id: req.body._id || `product_${Date.now()}`,
            ...req.body,
            updatedAt: new Date().toISOString()
        });

        // In a real implementation, you would also save to Couchbase
        // await couchbaseConnection.saveProduct(req.body);

        res.status(201).json({
            id: result.id,
            rev: result.rev,
            success: true
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const product = await productsDB.get(req.params.id);
        const result = await productsDB.put({
            ...product,
            ...req.body,
            _id: req.params.id,
            _rev: product._rev,
            updatedAt: new Date().toISOString()
        });

        // In a real implementation, you would also update in Couchbase
        // await couchbaseConnection.updateProduct(req.params.id, req.body);

        res.json({
            id: result.id,
            rev: result.rev,
            success: true
        });
    } catch (error) {
        console.error(`Error updating product ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await productsDB.get(req.params.id);
        const result = await productsDB.remove(product);

        // In a real implementation, you would also delete from Couchbase
        // await couchbaseConnection.deleteProduct(req.params.id);

        res.json({
            id: result.id,
            rev: result.rev,
            success: true
        });
    } catch (error) {
        console.error(`Error deleting product ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Sync endpoint
app.get('/sync', (req, res) => {
    res.json({
        status: 'Sync Gateway is running',
        persistentStorage: DB_DIR,
        message: 'Data is being persisted to disk'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Sync Gateway server running on port ${PORT}`);
    console.log(`PouchDB Server ready at http://localhost:${PORT}`);
    console.log(`Data is being persisted to ${DB_DIR}`);
}); 