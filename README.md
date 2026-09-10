# 🥬 FreshHarvest - Complete Online Grocery Order Microservices Platform

A production-grade, distributed Online Grocery Ordering microservices platform engineered with **Java 17/21/24**, **Spring Boot 3.3.4**, **Spring Cloud 2023.0.3 (Eureka, Gateway, OpenFeign)**, **Spring Security 6 with JJWT 0.12.x**, and a **modern, interactive Web Storefront & Admin Portal**.

---

## 🏛️ Microservices Architecture

```
                                  +-----------------------+
                                  |    Web Storefront     |
                                  |   & Admin Dashboard   |
                                  +-----------+-----------+
                                              |
                                              v (HTTP / JSON)
                                  +-----------+-----------+
                                  |      API Gateway      |
                                  |     (Port: 8080)      |
                                  | * JWT Authentication  |
                                  | * Dynamic Routing     |
                                  +-----+-----+-----+-----+
                                        |     |     |
              +-------------------------+     |     +-------------------------+
              |                               |                               |
              v                               v                               v
    +-------------------+           +-------------------+           +-------------------+
    |   Auth Service    |           |  Product Service  |           |   Order Service   |
    |   (Port: 8081)    |           |   (Port: 8082)    |           |   (Port: 8083)    |
    | * Spring Security |           | * Grocery Catalog |           | * Shopping Cart   |
    | * JJWT Issuance   |           | * Categories      |           | * Checkout Logic  |
    | * Customer/Admin  |           | * Stock Inventory |           | * OpenFeign Client|
    +-------------------+           +---------+---------+           +---------+---------+
                                              ^                               |
                                              | (OpenFeign: Stock Deduct)     |
                                              +-------------------------------+
                                                                              |
                                                                              | (OpenFeign: Process Payment)
                                                                              v
                                                                    +-------------------+
                                                                    |  Payment Service  |
                                                                    |   (Port: 8084)    |
                                                                    | * Card / UPI / COD|
                                                                    | * Delivery Track  |
                                                                    | * Refunds Ledger  |
                                                                    +-------------------+

                                  +-----------------------+
                                  | Eureka Service Registry|
                                  |     (Port: 8761)      |
                                  +-----------------------+
```

---

## 📦 Service Breakdown & Ports

| Service | Port | Database | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | N/A | Central service discovery registry |
| **API Gateway** | `8080` | N/A | Single entry point, JWT verification filter, CORS & static frontend host |
| **Auth Service** | `8081` | H2 (`authdb`) | User registration, login, profile, addresses, JJWT tokens |
| **Product Service** | `8082` | H2 (`productdb`) | Categories, grocery products, units (kg, g, L), atomic stock reduction |
| **Order Service** | `8083` | H2 (`orderdb`) | Shopping cart, checkout orchestration via Feign, order lifecycle |
| **Payment Service** | `8084` | H2 (`paymentdb`) | Payment simulation (UPI, Cards, COD), refunds, delivery tracking |
| **Web Storefront** | `8080` / Static | LocalStorage + REST | Modern single-page grocery supermarket & admin management UI |

---

## ⚡ Quick Start (1-Click Run)

The repository includes a self-contained Maven Wrapper (`mvnw.cmd` / `mvnw`), so **no local Maven installation is required!**

### Option 1: Start All Services via Windows Batch / PowerShell
Run the launcher script:
```powershell
.\start-all.bat
# or in PowerShell:
.\start-all.ps1
```
This script launches Eureka Server first, waits for it to initialize, and then boots Auth, Product, Payment, Order, and API Gateway in separate console windows.

To stop all services:
```powershell
.\stop-all.bat
# or in PowerShell:
.\stop-all.ps1
```

### Option 2: Build & Run with Docker Compose
```bash
# Compile and package all services
./mvnw clean package -DskipTests

# Start the cluster
docker-compose up --build
```

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `john@example.com` | `customer123` | Browse catalog, add to cart, checkout, view order history |
| **Admin** | `admin@grocery.com` | `admin123` | Full access + Admin Dashboard (add products, update stock, advance order status) |

*(You can also register any new customer account directly via the UI or the `/api/auth/register` API!)*

---

## 🔐 Security & JWT Architecture

1. **Authentication**:
   - `POST /api/auth/login` accepts credentials and generates a signed HMAC-SHA256 JWT containing `userId`, `email`, and `roles`.
2. **Gateway Verification**:
   - Every request to protected endpoints through `http://localhost:8080` is intercepted by the Gateway's `AuthenticationFilter`.
   - The Gateway validates token authenticity and expiry, extracts the claims, and injects request headers into downstream microservices:
     - `X-User-Id`
     - `X-User-Email`
     - `X-User-Roles`
3. **Open Endpoints**:
   - `/api/auth/login`, `/api/auth/register`
   - `GET /api/products`, `GET /api/categories`
   - Static resources (`/`, `/index.html`, `/styles.css`, `/app.js`)

---

## 🌐 Key REST API Endpoints

### Auth Service (`/api/auth`)
- `POST /api/auth/register` - Register a customer or admin
- `POST /api/auth/login` - Sign in and get JWT token
- `GET /api/auth/profile` - Get logged-in user profile & saved delivery addresses
- `POST /api/auth/address` - Add new delivery address
- `GET /api/auth/users` - (Admin) List registered users

### Product Service (`/api/products`, `/api/categories`)
- `GET /api/categories` - List grocery categories
- `GET /api/products` - List active grocery products (optional filters: `?categoryId=1&search=apple`)
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - (Admin) Add new grocery item
- `PUT /api/products/{id}` - (Admin) Update product details and stock
- `DELETE /api/products/{id}` - (Admin) Deactivate product
- `POST /api/products/deduct-stock` - Inter-service atomic stock deduction

### Order Service (`/api/cart`, `/api/orders`)
- `GET /api/cart` - View current customer basket
- `POST /api/cart/add` - Add grocery item to basket
- `PUT /api/cart/{id}?quantity=X` - Update item quantity
- `DELETE /api/cart/{id}` - Remove item from basket
- `DELETE /api/cart/clear` - Empty basket
- `POST /api/orders/checkout` - Place order (verifies stock & triggers payment via Feign)
- `GET /api/orders/user` - View logged-in customer's order history
- `GET /api/orders` - (Admin) View all orders in supermarket pipeline
- `PUT /api/orders/{id}/status` - (Admin) Advance status (`PACKING` -> `OUT_FOR_DELIVERY` -> `DELIVERED`)
- `POST /api/orders/{id}/cancel` - Cancel order, restore inventory stock, and refund payment

### Payment Service (`/api/payments`, `/api/delivery`)
- `POST /api/payments/process` - Process transaction (Credit/Debit, UPI, COD)
- `GET /api/payments/order/{orderId}` - View payment receipt
- `POST /api/payments/refund/{orderId}` - Refund cancelled order
- `GET /api/delivery/order/{orderId}` - Live delivery tracking details
- `PUT /api/delivery/status` - Update delivery tracking status

---

## 📊 In-Memory H2 Database Consoles

Each microservice includes an independent, isolated H2 database with web consoles enabled:
- **Auth DB**: `http://localhost:8081/h2-console` (JDBC URL: `jdbc:h2:mem:authdb`)
- **Product DB**: `http://localhost:8082/h2-console` (JDBC URL: `jdbc:h2:mem:productdb`)
- **Order DB**: `http://localhost:8083/h2-console` (JDBC URL: `jdbc:h2:mem:orderdb`)
- **Payment DB**: `http://localhost:8084/h2-console` (JDBC URL: `jdbc:h2:mem:paymentdb`)
*(Username: `sa`, Password: empty)*

---

## 💻 Tech Stack Summary
- **Language**: Java 24 / 21 / 17
- **Framework**: Spring Boot 3.3.4
- **Cloud Components**: Spring Cloud Netflix Eureka Server, Spring Cloud Gateway, Spring Cloud OpenFeign
- **Security**: Spring Security 6, JJWT 0.12.6
- **Persistence**: Spring Data JPA, Hibernate, H2 Database
- **Frontend**: HTML5, Modern Vanilla CSS Design System, JavaScript ES6+
