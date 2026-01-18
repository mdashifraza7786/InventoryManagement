# Inventory & Billing Manager PWA

A Progressive Web App for shopkeepers to manage inventory and billing with offline support.

## Features

- **Inventory Management**: Add, edit, delete products with SKU, category, price, stock quantity
- **Low Stock Alerts**: Visual badges and browser notifications when stock falls below threshold
- **Billing/Checkout**: Product selection, cart management, multiple payment methods
- **Stock Sync**: Automatic stock decrement on sale completion
- **PWA Support**: Installable on desktop/mobile, works offline
- **Offline Mode**: View products even without internet, offline banner notification

## Tech Stack

- **Frontend**: React.js 18, React Router, Axios
- **Backend**: Express.js, MongoDB, Mongoose
- **PWA**: Service Worker with CacheFirst/NetworkFirst strategies

## Folder Structure

```
InventoryManagement/
├── client/                 # React frontend
│   ├── public/
│   │   ├── icons/          # PWA icons
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js           # Service worker
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Dashboard, Checkout pages
│       ├── context/        # Global state management
│       └── services/       # API service layer
└── server/                 # Express backend
    ├── config/             # Database configuration
    ├── models/             # MongoDB schemas
    ├── controllers/        # Business logic
    └── routes/             # API routes
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenSSL (for HTTPS certificates)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_billing
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run mongod directly
mongod --dbpath /path/to/data
```

### 4. Run Development Servers

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

Access at `http://localhost:3000`

## PWA Testing (HTTPS Required)

PWA features require HTTPS. Follow these steps:

### 1. Generate SSL Certificates

```bash
cd client

# Create certificates directory
mkdir -p .cert

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout .cert/key.pem \
  -out .cert/cert.pem \
  -subj "/CN=localhost"
```

### 2. Create HTTPS Configuration

Create `client/.env` file:
```env
HTTPS=true
SSL_CRT_FILE=.cert/cert.pem
SSL_KEY_FILE=.cert/key.pem
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run with HTTPS

```bash
cd client
npm start
```

Access at `https://localhost:3000`

### 4. Production Build

```bash
cd client
npm run build

# Serve with a static server (e.g., serve)
npx serve -s build --ssl-cert .cert/cert.pem --ssl-key .cert/key.pem
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale (decrements stock)
- `GET /api/sales/daily` - Get today's sales summary

## Service Worker Caching Strategies

| Resource | Strategy |
|----------|----------|
| Static Assets (JS, CSS, HTML) | CacheFirst |
| `/api/products` | NetworkFirst |
| Other API calls | NetworkOnly |

## Testing Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Verify:
   - "Running Offline" banner appears
   - Product list is still visible (cached)
   - Sales cannot be completed (disabled button)

## Browser Notifications

1. Click "Enable Alerts" on Dashboard
2. Allow notification permission
3. Make a sale that causes low stock
4. Receive browser notification

## License

MIT
