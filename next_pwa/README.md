# EdgeCart - Next.js PWA with Offline Support

This is a Next.js Progressive Web App (PWA) with offline support using PouchDB and sync capabilities with a backend server via a Sync Gateway.

## Features

- **Progressive Web App**: Works offline and can be installed on mobile devices
- **Offline Data Storage**: Uses PouchDB for client-side storage
- **Data Synchronization**: Syncs data with the server when online
- **Responsive Design**: Works on all device sizes
- **Product Management**: Add and view products with offline support

## Architecture

The application uses a two-tier architecture:

1. **Client-side (PouchDB)**:

   - Stores data locally in the browser
   - Works offline
   - Syncs with the server when online

2. **Server-side (Sync Gateway)**:
   - Acts as a middleman between PouchDB and the backend database
   - Handles authentication and authorization
   - Manages data synchronization

```
[ User Device ]
     |
     | User fills form (saved to PouchDB)
     |
     | Sync Starts (when online)
     v
[ Sync Gateway ]
     |
     | Auth + Permissions + Sync Rules
     v
[ Couchbase Server ]
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd next_pwa
```

2. Install dependencies:

```bash
npm install
```

3. Start the Next.js development server:

```bash
npm run dev
```

4. In a separate terminal, start the Sync Gateway server:

```bash
cd server
npm install
npm run dev
```

### Usage

- Open [http://localhost:3000](http://localhost:3000) to access the application
- The Sync Gateway server runs on [http://localhost:4984](http://localhost:4984)
- Add products using the form at [http://localhost:3000/addProducts](http://localhost:3000/addProducts)
- View products at [http://localhost:3000/products](http://localhost:3000/products)
- Test offline functionality by turning off your network connection

## Offline Functionality

The application works offline thanks to:

1. **Service Worker**: Caches assets and API responses
2. **PouchDB**: Stores data locally in the browser
3. **Sync Mechanism**: Syncs data with the server when online

## Deployment

### Next.js Frontend

The easiest way to deploy the Next.js app is to use the [Vercel Platform](https://vercel.com).

### Sync Gateway Server

For production, you should use the actual Couchbase Sync Gateway. The server included in this project is a simplified version for development purposes.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PouchDB Documentation](https://pouchdb.com/guides/)
- [Couchbase Sync Gateway](https://docs.couchbase.com/sync-gateway/current/index.html)
