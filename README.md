# Help Study Abroad – Senior Frontend Technical Assessment

A production-grade, highly performant administrative dashboard web application built strictly adhering to the technical assessment guidelines.

Built using **Next.js (App Router)**, **JavaScript**, **Material UI (MUI v5)**, and **Zustand** for state management, interacting with the **DummyJSON REST API** through native `fetch`.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Authentication Credentials](#-authentication-credentials)
- [DummyJSON API Endpoints](#-dummyjson-api-endpoints)
- [State Management & Zustand Architecture](#-state-management--zustand-architecture)
- [Client-Side Caching Strategy](#-client-side-caching-strategy)
- [Performance Optimizations](#-performance-optimizations)
- [Evaluation Checklist & Verification](#-evaluation-checklist--verification)

---

## 🚀 Project Overview

The application serves as the **Admin Portal** for **Help Study Abroad**, enabling administrative staff to securely authenticate, observe organizational metrics, search and manage users across different roles, and explore the product catalog with rich attribute displays, image carousels, and category filters.

### Design Principles
- **Strict Dependency Discipline**: Zero bloat. No Axios, no Redux, no Tailwind CSS, no third-party carousel widgets. Everything is built natively with MUI and React capabilities.
- **Enterprise UI/UX**: Polished administrative theme, custom color palette, responsive drawer navigation, skeleton loading indicators, empty states, and toast notifications.
- **Resilient State Architecture**: Isolated Zustand stores with built-in async actions, automated localStorage persistence for credentials, and in-memory parameter caching.

---

## ✨ Key Features

### 1. Authentication & Route Protection
- Responsive Admin Login page with validation and loading indicators.
- Direct integration with DummyJSON `POST /auth/login`.
- Session token and user profile persisted in `localStorage` via Zustand middleware.
- Client-side route protection (`AuthGuard`): redirects unauthenticated visitors to `/login`.
- `GuestGuard`: prevents authenticated users from revisiting the login page.
- Instant 1-click demo credential autofill for fast reviewing.
- Clean session logout functionality with automatic memory clearing.

### 2. Admin Dashboard Overview
- Live analytical metric cards: Total Registered Users, Total Catalog Items, Category Counts, and Active Session status.
- Quick navigation cards to jump into User and Product directories.
- Recent User Registrations table preview.
- Featured Product Catalog preview cards.

### 3. Users Management
- Responsive MUI Data Table showing: User (with avatar and username), Email, Gender (color-coded chips), Phone, and Company affiliation.
- **API-Side Pagination**: Full `limit` and `skip` query integration using MUI `TablePagination`.
- **Search Filtering**: Real-time debounced search by name, username, or email (`/users/search?q=...`).
- Skeletons for table loading, error banners with retry action, and helpful empty search feedback.
- Click any row to navigate to the individual User Detail view.
- **User Detail Page (`/users/[id]`)**: Full demographic data, university education, physical traits, company department, address, banking info, and crypto wallet. Includes a "Back to Users" button.

### 4. Products Management
- Responsive MUI Grid Layout (1 to 4 columns depending on device breakpoint).
- Product cards showing thumbnail, title, price, discount badge, rating stars, category tag, and stock indicator.
- **Category Filter Dropdown**: Dynamically populated from `GET /products/categories`.
- **Search Filter**: Debounced search bar querying DummyJSON search API.
- **API-Side Pagination**: Dynamically updates limit and skip with page change controls.
- **Single Product Page (`/products/[id]`)**:
  - Interactive multi-image gallery/carousel with thumbnail selector strip, counter badge, and next/prev controls.
  - Price and discount calculations.
  - Stock availability status.
  - Technical specifications table: Dimensions, weight, SKU, tags, minimum order quantity.
  - Warranty, shipping terms, and return policy cards.
  - Customer review list with star ratings and reviewer feedback.
  - "Back to Products" link.

---

## 🛠 Technology Stack

| Technology | Purpose | Notes |
|---|---|---|
| **Next.js 14** (App Router) | Core Framework | Server and client component routing |
| **JavaScript (ES6+)** | Language | Strictly JavaScript (no TypeScript) |
| **Material UI (MUI v5)** | UI Component Library | Complete UI: Cards, Tables, Grids, Modals |
| **@emotion/react & styled** | Styling Engine | Zero Tailwind CSS or Bootstrap |
| **Zustand** | Global State Management | Asynchronous stores with persistence |
| **Fetch API** | HTTP Client | Built-in browser/Node fetch (no Axios) |

---

## 📂 Folder Structure

```text
FrontendTechnicalAssesment/
├── app/
│   ├── dashboard/
│   │   └── page.js               # Dashboard metrics and overview
│   ├── login/
│   │   └── page.js               # Responsive admin login page
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.js           # Single product detail view & gallery
│   │   └── page.js               # Products catalog with search & category filter
│   ├── users/
│   │   ├── [id]/
│   │   │   └── page.js           # Single user detail view
│   │   └── page.js               # Users table with API pagination & search
│   ├── layout.js                 # Global HTML shell with ThemeRegistry
│   └── page.js                   # Root entry redirecting based on auth
├── components/
│   ├── auth/
│   │   ├── AuthGuard.js          # Protects private dashboard routes
│   │   └── GuestGuard.js         # Redirects authenticated users away from login
│   ├── layout/
│   │   └── DashboardLayout.js    # Responsive drawer, header, and user profile menu
│   ├── products/
│   │   ├── ImageGallery.js       # Interactive product carousel & thumbnails
│   │   └── ProductCard.js        # Memoized product card
│   └── users/
│       └── UserTableRow.js       # Memoized user table row
├── services/
│   └── api.js                    # Fetch-based API client for DummyJSON
├── store/
│   ├── authStore.js              # Zustand store for authentication + persistence
│   ├── productStore.js           # Zustand store for products + caching
│   └── userStore.js              # Zustand store for users + caching
├── theme/
│   ├── theme.js                  # Custom MUI theme (colors, typography, overrides)
│   └── ThemeRegistry.js          # Emotion cache provider for Next.js App Router
├── .env.example                  # Environment configuration template
├── jsconfig.json                 # Path aliases (@/*)
├── next.config.js                # Next.js image domain configurations
├── package.json                  # Minimal dependencies manifest
└── README.md                     # Complete documentation
```

---

## ⚡ Getting Started & Installation

### Prerequisites
- Node.js `v18.17.0` or later (tested on Node v20/v24)
- npm `v9+`

### 1. Clone or Open the Repository
```bash
git clone <your-repo-url>
cd FrontendTechnicalAssesment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
The application works immediately out-of-the-box. If desired, you can create a `.env.local` file:
```bash
cp .env.example .env.local
```
Content:
```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Authentication Credentials

The app integrates with DummyJSON's official authentication API. You can sign in using any valid DummyJSON account or click the **demo buttons** on the login screen:

| Role | Username | Password |
|---|---|---|
| **Admin Demo 1** | `emilys` | `emilyspass` |
| **Admin Demo 2** | `michaelw` | `michaelwpass` |

*(Testing with invalid credentials triggers an error alert from the server: `"Invalid credentials"`).*

---

## 🌐 DummyJSON API Endpoints Used

- **Auth Login**: `POST https://dummyjson.com/auth/login`
- **Users List**: `GET https://dummyjson.com/users?limit={limit}&skip={skip}`
- **Users Search**: `GET https://dummyjson.com/users/search?q={query}&limit={limit}&skip={skip}`
- **Single User**: `GET https://dummyjson.com/users/{id}`
- **Products List**: `GET https://dummyjson.com/products?limit={limit}&skip={skip}`
- **Products Search**: `GET https://dummyjson.com/products/search?q={query}&limit={limit}&skip={skip}`
- **Product Categories**: `GET https://dummyjson.com/products/categories`
- **Category Filter**: `GET https://dummyjson.com/products/category/{category}?limit={limit}&skip={skip}`
- **Single Product**: `GET https://dummyjson.com/products/{id}`

---

## 🧠 State Management & Zustand Architecture

### Why Zustand Was Chosen Over Redux:
1. **Minimal Bundle Footprint**: Zustand weighs less than 1KB gzipped, compared to ~15KB+ for Redux Toolkit.
2. **Zero Boilerplate**: No actions, reducers, dispatched actions, or nested context providers wrapping the entire component tree.
3. **Native Asynchronous Actions**: Async API calls reside directly inside the store object (`async fetchUsers(...)`), executing side effects cleanly.
4. **Fine-Grained Reactivity**: Components subscribe only to the slices of state they require (e.g. `const users = useUserStore(s => s.users)`), preventing cascading re-renders.
5. **Seamless Persistence**: The `persist` middleware automatically syncs the auth state to `localStorage` with SSR-safe hydration callbacks.

---

## ⚡ Client-Side Caching Strategy

### Why Caching Is Useful:
Repeatedly fetching identical datasets when users toggle pages, navigate to product/user details and press "Back", or switch categories wastes bandwidth and degrades user experience.

### Implementation:
An in-memory dictionary cache is maintained directly in both `userStore` and `productStore`:
- **Users Cache Key**: `users_${limit}_${skip}_${normalizedQuery}`
- **Products Cache Key**: `products_${limit}_${skip}_${normalizedQuery}_${category}`
- **Detail Cache**: `detailCache[id]` stores individual entity payloads.

When an action like `fetchUsers` or `fetchProducts` is triggered:
1. It generates the unique composite cache key based on query parameters.
2. If `cache[cacheKey]` exists and `forceRefresh` is false, it returns the cached data immediately with zero network delay.
3. If not cached, it dispatches the `fetch` call, receives the payload, and saves it to the cache dictionary for future lookups.
4. Users can manually bypass the cache anytime using the **Refresh Data** button.

---

## 🏎 Performance Optimizations

1. **`React.memo`**: Applied to `ProductCard` and `UserTableRow`. Prevents list rows/cards from re-rendering when parent state (such as page title or drawer toggle) changes.
2. **`useCallback` & `useMemo`**: Used for debounced search dispatchers, pagination handlers, and derived zero-index page math.
3. **API-Side Pagination**: Avoids loading hundreds of items at once; requests only what is currently viewed (e.g., 10 items at a time with `limit` and `skip`).
4. **Search Debouncing**: Enforces a 400ms debounce on search input changes to prevent unnecessary API rate-limiting or network congestion.

---

## ✅ Evaluation Checklist & Verification

- [x] **New Next.js project with App Router**
- [x] **Strictly JavaScript (no TypeScript)**
- [x] **Material UI (MUI) for all visual components**
- [x] **Zustand stores with asynchronous actions & comments**
- [x] **DummyJSON REST API endpoints integration via Fetch**
- [x] **Admin Login page with validation, loading, and error handling**
- [x] **Authentication state persistence & route protection**
- [x] **Responsive Admin Dashboard with drawer and navbar**
- [x] **Users table with API-side pagination (`limit`/`skip`) and search**
- [x] **User detail page with comprehensive demographic profile & "Back" link**
- [x] **Products responsive grid with search and category filter**
- [x] **Product detail page with interactive carousel, specs, reviews & "Back" link**
- [x] **In-memory client-side caching implemented and documented**
- [x] **Performance optimizations (`React.memo`, `useCallback`, `useMemo`)**
- [x] **Clean, modular project structure**
- [x] **Successful production build (`npm run build`)**
