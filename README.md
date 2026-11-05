# Help Study Abroad – Admin Dashboard (Frontend Assessment)

Live Demo: [https://frontend-technical-assesment-one.vercel.app/](https://frontend-technical-assesment-one.vercel.app/)  
Repository: [https://github.com/Ankush-Yadav26/FrontendTechnicalAssesment](https://github.com/Ankush-Yadav26/FrontendTechnicalAssesment)

Frontend technical assessment built with Next.js (App Router), JavaScript, Material UI (MUI), and Zustand. Integrates with the public DummyJSON REST API for authentication, user management, and product catalog data.

---

## Tech Stack

- **Next.js 14** (App Router)
- **JavaScript (ES6+)**
- **Material UI (MUI v5)** & `@emotion/react` / `@emotion/styled`
- **Zustand** (with `persist` middleware for session storage)
- **Native Fetch API** (no Axios or heavy wrappers)

---

## Features

### 1. Authentication
- Admin login interface built with MUI form components.
- Direct authentication via DummyJSON `POST /auth/login`.
- Session persistence in `localStorage` through Zustand.
- Protected route guards (`AuthGuard` for private routes, `GuestGuard` for `/login`).
- Logout clears the stored session and resets memory.
- Quick demo autofill chips on the login page for testing.

### 2. Admin Dashboard
- Overview stats for total registered users, products, and categories.
- Direct navigation links to Users and Products sections.
- Preview cards for recent user signups and featured products.
- Responsive layout with collapsible sidebar drawer on mobile and persistent sidebar on desktop.

### 3. Users Management
- Responsive table displaying user details (Name, Email, Gender, Phone, Company).
- API-side pagination using `limit` and `skip`.
- Debounced search filter querying `GET /users/search?q=...`.
- Loading skeletons, empty states, and error alerts with retry triggers.
- Individual user profile view (`/users/[id]`) with company, contact, education, address, and masked bank info.
- "Back to Users" button.

### 4. Products Management
- Responsive grid layout (1 to 4 columns across breakpoints).
- Cards displaying thumbnail, title, price, discount badge, stock, category, and ratings.
- Category filter dropdown populated dynamically from `GET /products/categories`.
- Debounced search querying `GET /products/search?q=...`.
- API-side pagination with rows per page controls.
- Single product page (`/products/[id]`) featuring an interactive multi-image carousel with thumbnail strip, full specifications, warranty/shipping details, and customer reviews.
- "Back to Products" button.

---

## Project Structure

```text
FrontendTechnicalAssesment/
├── app/
│   ├── dashboard/page.js         # Dashboard overview
│   ├── login/page.js             # Admin login page
│   ├── products/
│   │   ├── [id]/page.js          # Product detail view & image gallery
│   │   └── page.js               # Products list with search & category filter
│   ├── users/
│   │   ├── [id]/page.js          # User detail view
│   │   └── page.js               # Users table with API pagination & search
│   ├── layout.js                 # Root layout with ThemeRegistry
│   ├── not-found.js              # 404 page
│   └── page.js                   # Root entry point with session redirect
├── components/
│   ├── auth/
│   │   ├── AuthGuard.js          # Private route protector
│   │   └── GuestGuard.js         # Guest redirect for /login
│   ├── layout/
│   │   └── DashboardLayout.js    # Sidebar, topbar, and mobile drawer
│   ├── products/
│   │   ├── ImageGallery.js       # Product image switcher with thumbnails
│   │   └── ProductCard.js        # Memoized product grid card
│   └── users/
│       └── UserTableRow.js       # Memoized user table row
├── services/
│   └── api.js                    # Fetch-based API client with timeout
├── store/
│   ├── authStore.js              # Auth state & persistence
│   ├── productStore.js           # Products state, pagination & in-memory cache
│   └── userStore.js              # Users state, pagination & in-memory cache
├── theme/
│   ├── theme.js                  # Custom MUI theme (colors, typography)
│   └── ThemeRegistry.js          # Emotion cache for Next.js App Router
├── .env.example
├── jsconfig.json
├── next.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/Ankush-Yadav26/FrontendTechnicalAssesment.git
cd FrontendTechnicalAssesment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
The app defaults to `https://dummyjson.com` automatically. If you want to configure it explicitly:
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build
```bash
npm run build
npm run start
```

---

## Test Credentials (DummyJSON)

You can use the demo buttons on the login screen or enter either of the following accounts:

| Username | Password | Notes |
|---|---|---|
| `emilys` | `emilyspass` | Admin Demo |
| `michaelw` | `michaelwpass` | Alternative user |

Invalid inputs return standard 400 error messaging from the API.

---

## API Endpoints Used

- **Auth Login**: `POST https://dummyjson.com/auth/login`
- **Users**: `GET https://dummyjson.com/users?limit={limit}&skip={skip}`
- **Users Search**: `GET https://dummyjson.com/users/search?q={query}&limit={limit}&skip={skip}`
- **User Details**: `GET https://dummyjson.com/users/{id}`
- **Products**: `GET https://dummyjson.com/products?limit={limit}&skip={skip}`
- **Products Search**: `GET https://dummyjson.com/products/search?q={query}&limit={limit}&skip={skip}`
- **Categories**: `GET https://dummyjson.com/products/categories`
- **Category Filter**: `GET https://dummyjson.com/products/category/{category}?limit={limit}&skip={skip}`
- **Product Details**: `GET https://dummyjson.com/products/{id}`

---

## Architecture & Implementation Notes

### Why Zustand Over Redux
- **Bundle Size**: Under 1KB gzipped, compared to Redux Toolkit (~15KB+).
- **No Reducer Boilerplate**: Actions are standard async functions written directly in the store, avoiding actions/reducers/dispatch separation.
- **Selective Subscriptions**: Components subscribe only to the slices they consume (e.g. `const users = useUserStore(s => s.users)`), preventing global re-renders.
- **Straightforward Persistence**: The `persist` middleware syncs authentication tokens to `localStorage` without external packages.

### Client-Side Caching Strategy
To reduce redundant server round-trips when switching between pages or applying repeat search terms, an in-memory dictionary cache is kept in both `userStore` and `productStore`:
- **Users Cache Key**: `users_${limit}_${skip}_${normalizedQuery}`
- **Products Cache Key**: `products_${limit}_${skip}_${normalizedQuery}_${category}`
- **Detail Cache**: `detailCache[id]`

If a query with identical parameters has already resolved, the store serves the result from the cache instantly. Users can bypass the cache by clicking the "Refresh" button.

### Asynchronous Race Condition Handling
To prevent out-of-order race conditions when users type quickly into search inputs, each store tracks a monotonically increasing request ID (`lastRequestId`). If a slower, earlier request resolves after a newer request, the stale payload is discarded.

### Performance Optimizations
- **`React.memo`**: Applied to `ProductCard` and `UserTableRow` so list items do not re-render when parent navigation or dashboard drawer states update.
- **`useCallback` / `useMemo`**: Used for stable handlers, pagination calculations, and debounced triggers.
- **API-Side Pagination**: Only loads the current view window (10 or 12 items at a time) rather than fetching full datasets into memory.
- **Search Debounce**: 400ms debounce window prevents spamming the API on every keystroke.
