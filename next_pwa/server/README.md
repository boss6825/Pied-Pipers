# Sync Gateway Server

This is a simplified implementation of a Sync Gateway server for the EdgeCart application. It serves as a middleman between the PouchDB client and the backend database.

## Overview

In a production environment, you would use Couchbase Sync Gateway to synchronize data between PouchDB clients and a Couchbase Server. This implementation provides a simplified version for development purposes.

## Features

- REST API for products (CRUD operations)
- Persistent storage using PouchDB on the server
- Sync endpoint for PouchDB clients
- CORS support for cross-origin requests

## Directory Structure

```
server/
  ├── databases/         # Directory for persistent PouchDB databases
  ├── sync-gateway.js    # Main server file
  ├── package.json       # Dependencies and scripts
  └── README.md          # This file
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm run dev
```

The server will start on port 4984 by default.

## API Endpoints

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get a product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Sync

- `GET /sync` - Check if the Sync Gateway is running

## Integration with Couchbase

In a production environment, you would replace the PouchDB implementation with a connection to a Couchbase Server. The code includes commented sections showing where you would add this integration.

Example:

```javascript
const couchbaseConnection = new CouchbaseServer({
  url: process.env.COUCHBASE_URL || "couchbase://localhost",
  username: process.env.COUCHBASE_USERNAME || "Administrator",
  password: process.env.COUCHBASE_PASSWORD || "password",
});

// Then in your routes:
await couchbaseConnection.saveProduct(product);
```

## Configuration

The server can be configured using environment variables:

- `PORT` - The port to run the server on (default: 4984)
- `COUCHBASE_URL` - The URL of the Couchbase Server (when implemented)
- `COUCHBASE_USERNAME` - The username for the Couchbase Server (when implemented)
- `COUCHBASE_PASSWORD` - The password for the Couchbase Server (when implemented)

## Data Persistence

The server stores data in the `databases` directory. This provides persistence across server restarts. In a production environment, you would use Couchbase Server for more robust data storage.
