# ShopHub — Enterprise E-Commerce Frontend

A modern, responsive, portfolio-grade e-commerce frontend architected for a Java Spring Boot microservices backend ecosystem.

Built with **React**, **Vite**, **Material UI (MUI v6)**, **Redux Toolkit**, **TanStack Query**, and **React Hook Form + Zod**.

---

## 🌟 Architecture & Key Highlights

- **Repository Pattern Architecture**: Complete separation of UI components from data fetching. The UI consumes clean repository interfaces (`productRepository`, `orderRepository`, `inventoryRepository`, `paymentRepository`, `customerRepository`).
- **Zero-Code Backend Switch**: Switch between in-memory mock mode and live Spring Boot microservices via a single environment variable (`VITE_USE_MOCK=false`).
- **Role-Based Access Control (RBAC)**: Secure, multi-role routing supporting **Customer**, **Admin**, and **Inventory Manager** portals with automatic redirection and route guards (`RequireAuth`, `RequireRole`, `GuestOnly`).
- **State Management**:
  - **Redux Toolkit**: Client-side shared state (Persistent Shopping Cart in LocalStorage, Mock Authentication Session).
  - **TanStack Query (React Query)**: Server-state caching, optimistic updates, and background invalidations for catalog, inventory, and order data.
- **Enterprise Design System**: Custom MUI Theme with curated color tokens, responsive navigation layouts, loading skeletons, accessible typography, and smooth micro-interactions.
- **Interactive Dashboards**: Data visualizations built with **Recharts** for sales trends, category distribution, and warehouse stock tracking.

---

## 👥 Demo Accounts & Credentials

The application includes local demonstration authentication with pre-configured quick-login buttons on `/login`:

| Role | Email | Password | Portal / Default Redirect |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@demo.com` | `Customer@123` | Storefront (`/shop`) |
| **Admin** | `admin@demo.com` | `Admin@123` | Admin Dashboard (`/admin/dashboard`) |
| **Inventory Manager** | `inventory@demo.com` | `Inventory@123` | Inventory Portal (`/inventory/dashboard`) |

> *Note: Mock authentication is intended for demo and development. Production integration will delegate token exchange and authorization to the Spring Boot Identity Service.*

---

## 🗺️ Route Directory

### 🛒 Customer Storefront
- `/` & `/shop` — Storefront homepage with hero, featured products, categories, and value banners
- `/products` — Full product catalog with real-time search, category filtering, price sorting, and pagination
- `/products/:productId` — Product detail page with image gallery, quantity selector, and stock status
- `/cart` — Interactive shopping cart with quantity adjustments and persistent storage
- `/checkout` — Multi-step checkout with address validation, payment simulator, and order summary (`RequireAuth`)
- `/my-orders` — Customer order history with status chips (`RequireAuth`)
- `/my-orders/:orderId` — Detailed order tracking with status stepper, items summary, and cancellation (`RequireAuth`)
- `/profile` — Customer profile and default shipping address management (`RequireAuth`)

### ⚡ Admin Management Portal (`RequireRole(['ADMIN'])`)
- `/admin/dashboard` — Executive KPI overview, monthly revenue area chart, category sales bar chart, and recent orders
- `/admin/products` — Product catalog management with search, category filtering, active toggle switch, and delete confirmations
- `/admin/products/new` — Create new product with React Hook Form + Zod schema validation
- `/admin/products/:productId/edit` — Edit existing product details
- `/admin/orders` — Orders table with customer info, fulfillment status management dialog, and search
- `/admin/customers` — Registered customer accounts, metrics, and locations

### 📦 Inventory Management Portal (`RequireRole(['INVENTORY_MANAGER', 'ADMIN'])`)
- `/inventory/dashboard` — Stock health overview, total SKUs, available vs reserved inventory chart, and restock alerts
- `/inventory/stock` — Warehouse inventory table with safe stock adjustment dialog (prevents negative balances)
- `/inventory/low-stock` — Dedicated low-stock alert monitoring with quick restock (+10, +25, +50 units)
- `/inventory/reservations` — Order reservation history and allocated items audit trail

### 🔐 Authentication & Error Routes
- `/login` — Login page with demo credentials quick selector (`GuestOnly`)
- `/unauthorized` — 403 Forbidden page with role-aware back navigation
- `*` — 404 Not Found page

---

## 🏗️ Spring Boot Microservices Integration Guide

The frontend is specifically structured to map directly to your backend microservices:

```
[ Frontend Client ] 
        │
        ▼ (Single Base URL: VITE_API_BASE_URL)
[ Spring Cloud API Gateway ] (Port: 8080)
   ├── /api/auth/**         ──►  [ Identity Service ]
   ├── /api/products/**     ──►  [ Product Service ]
   ├── /api/orders/**       ──►  [ Order Service ]
   ├── /api/inventory/**    ──►  [ Inventory Service ]
   ├── /api/payments/**     ──►  [ Payment Service ]
   └── /api/notifications/**──►  [ Notification Service ]
```

### Proposed REST API Contract

| Microservice | Endpoint | Method | Description / Request Body | Response Object |
| :--- | :--- | :--- | :--- | :--- |
| **Identity Service** | `/api/auth/login` | `POST` | `{ email, password }` | `{ user: { id, name, email, role }, token }` |
| **Identity Service** | `/api/auth/me` | `GET` | *(Bearer token in header)* | `{ id, name, email, role, address }` |
| **Product Service** | `/api/products` | `GET` | Query params: `page`, `pageSize`, `category`, `search`, `sortBy` | `{ items: Product[], total, page, pageSize }` |
| **Product Service** | `/api/products/{id}` | `GET` | Path param: `id` | `Product` |
| **Product Service** | `/api/products` | `POST` | `{ name, category, brand, price, images, ... }` | `Product` (created) |
| **Product Service** | `/api/products/{id}` | `PUT` | Product updates | `Product` (updated) |
| **Product Service** | `/api/products/{id}` | `DELETE` | Path param: `id` | `{ success: true }` |
| **Order Service** | `/api/orders` | `POST` | `{ items, shippingAddress, paymentMethod }` | `Order` (status: `PENDING`) |
| **Order Service** | `/api/orders/my` | `GET` | Customer orders | `Order[]` |
| **Order Service** | `/api/orders/{id}` | `GET` | Order details | `Order` |
| **Order Service** | `/api/orders/{id}/cancel`| `POST`| Order ID | `Order` (status: `CANCELLED`) |
| **Order Service** | `/api/orders/{id}/status`| `PATCH`| `{ status }` | `Order` |
| **Inventory Service** | `/api/inventory` | `GET` | Query params: `search`, `page`, `pageSize` | `{ items: InventoryItem[], total }` |
| **Inventory Service** | `/api/inventory/{productId}/stock` | `PATCH` | `{ delta, reason }` | `InventoryItem` |
| **Inventory Service** | `/api/inventory/low-stock` | `GET` | Threshold query | `InventoryItem[]` |
| **Inventory Service** | `/api/inventory/reservations` | `GET` | Reservations audit | `Reservation[]` |
| **Payment Service** | `/api/payments/initiate` | `POST` | `{ orderId, amount, method }` | `{ id, status, transactionRef }` |

### How to Switch to Real APIs
1. In `.env`, set:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_MOCK=false
   ```
2. Ensure your Spring Boot API Gateway is running on `http://localhost:8080`.
3. The HTTP repositories in `src/services/repositories/` will automatically be loaded instead of the mock repositories, without touching any UI code or React components.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Siddpawar9222/Ecommerce-Microservices.git
cd ecommerce-microservices-fe

# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running Tests
```bash
# Run unit and component test suite
npm test
```

### Production Build
```bash
# Run production bundle build
npm run build

# Preview production build locally
npm run preview
```

### Code Quality (ESLint)
```bash
# Run ESLint validation
npm run lint
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.jsx             # Main application component
│   ├── providers.jsx       # Theme, Redux, React Query, and Session providers
│   └── router.jsx          # Declarative React Router config with guards
├── assets/                 # SVGs, icons, and static assets
├── components/
│   ├── common/             # Reusable UI (ProductCard, PageHeader, StatusBadge, RouteGuards, ConfirmDialog)
│   ├── feedback/           # Feedback widgets (Toast, EmptyState, ErrorMessage)
│   └── layout/             # CustomerLayout, AdminLayout, InventoryLayout, Navbar, Footer
├── features/
│   ├── admin/              # Admin pages (Dashboard, Products, Orders, Customers)
│   ├── auth/               # Login, Unauthorized, NotFound, Profile pages & authSlice
│   ├── cart/               # Cart page, persistent cartSlice, selectors
│   ├── checkout/           # Multi-step checkout simulation page
│   ├── inventory/          # Inventory pages (Dashboard, Stock, Low Stock Alerts, Reservations)
│   ├── orders/             # Order list and order detail tracking pages
│   └── products/           # Shop home, product list, product detail pages
├── mocks/
│   ├── data/               # In-memory mock datasets (products, orders, inventory, users, payments)
│   ├── repositories/       # In-memory mock implementations of repository contracts
│   └── utils/              # Mock delay and ID generators
├── services/
│   ├── api/                # Axios httpClient, endpoints constants, config
│   └── repositories/       # HTTP repository implementations & Repository Factory
├── store/                  # Redux Toolkit store configuration
├── theme/                  # MUI theme, custom design tokens, global styles
└── utils/                  # Helpers, validation schemas, and constants
```

---

## 🛡️ License

This project is built for portfolio and educational demonstration purposes.
