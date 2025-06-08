# 🧾 EdgeCart: Offline-First Smart Checkout Kiosk  
*by Pied Pipers*

## 🌟 Overview

**EdgeCart** is a lightweight, offline-first smart checkout system designed for rural and low-connectivity regions. Built on Raspberry Pi 4, the system enables local retailers to seamlessly process customer checkouts, store transactions locally, and sync them with the central Walmart cloud infrastructure when connectivity is available.

This solution directly supports Walmart Sparkathon’s themes of:
- **Reimagining Customer Experience**
- **Transforming the Retail Supply Chain**
- **Building Trust in Retail using Edge Computing and Resilience**

---

## 🧠 How It Works

### 🛍️ Core Checkout Flow
1. Customers select products; cashier adds them via a simple UI.
2. A transaction is created locally with a unique UUID.
3. All order data is stored in a **local SQLite database**.
4. The transaction UUID is pushed to a **persistent message queue** (stored locally).
5. The customer is checked out even without internet connectivity.

### 🔁 Sync Mechanism
- A background service monitors network availability.
- When connectivity is restored:
  - UUIDs are dequeued.
  - The transaction data is pushed to the **Walmart Cloud API** (or simulation server).
  - On successful sync, the entry is removed from the local queue.

---

## 🧱 Architecture

- **Frontend**: Web UI (React/HTML) running locally in Chromium or kiosk mode.
- **Backend**: Node.js Express server handling logic & APIs.
- **Local Storage**: SQLite DB + llIndexDB + persistent file-backed message queue.
- **Sync Engine**: Background service in Node.js  using event loop.
- **Platform**: Raspberry Pi 4 (4GB RAM) running Raspberry Pi OS.

![System Architecture](docs/EdgeCart_architecture.png)

---

## ⚙️ Hardware Requirements

- ✅ Raspberry Pi 4 Model B (4GB)
- ✅ 32GB+ microSD Card (Class 10)
- ✅ 5V 3A Power Adapter
- ✅ Local display or touch screen (optional)
- ✅ USB barcode scanner (optional)

---

## 🛠️ Software Stack

| Layer              | Tech         |
|--------------------|--------------|
| Frontend + Backend | NextJS |
| Local DB           | SQLite3 , IndexDB|
| Queue              | File-backed JSON Queue |
| Sync Logic         | Node.js Worker / Cron Job |
| Cloud API          | AWS |
| OS                 | Raspberry Pi OS (Lite or Full) |

---

## 🚀 Getting Started

### 1. Flash Raspberry Pi OS
- Use [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash Raspberry Pi OS (Lite or Desktop) to SD card.

### 2. Clone Repo & Install
```bash
git clone https://github.com/boss6825/Pied-Pipers.git
cd checkoutlite
npm install
