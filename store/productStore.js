/**
 * Products Store with API-side Pagination, Category Filtering, and Client-Side Caching.
 * 
 * WHY ZUSTAND WAS CHOSEN:
 * - Ultra-lightweight and reactive state management.
 * - Simple to modularize per business domain (authStore, userStore, productStore).
 * - Async actions reside directly within the store, providing cohesive business logic.
 * - Minimal re-renders in React thanks to selective subscription.
 * 
 * HOW ASYNCHRONOUS ACTIONS WORK:
 * - Actions like `fetchProducts` and `fetchCategories` trigger state updates before and after network operations.
 * - Loading and error states are tracked to inform the UI (e.g. Skeletons, Error Alerts, Empty state notices).
 * 
 * WHY CACHING IS USEFUL & CACHING STRATEGY IMPLEMENTED:
 * - Prevents repetitive network requests when the user toggles between product pages, searches, or categories.
 * - Makes page transitions instantaneous and saves server bandwidth.
 * - Strategy: In-memory dictionary `cache[cacheKey]` where:
 *   `cacheKey = products_${limit}_${skip}_${query}_${category}`.
 *   Single product details are also cached by ID in `detailCache[id]`.
 * 
 * HOW API-SIDE PAGINATION WORKS:
 * - Relies on DummyJSON query parameters: `limit` and `skip`.
 * - `skip` determines the offset (`skip = page * limit`).
 * - Total product count is returned by the API and drives the MUI Pagination/TablePagination controls.
 */

import { create } from 'zustand';
import {
  fetchProductsList,
  fetchProductCategories,
  fetchProductById as fetchProductByIdApi,
} from '@/services/api';

export const useProductStore = create((set, get) => ({
  products: [],
  total: 0,
  limit: 10,
  skip: 0,
  searchQuery: '',
  selectedCategory: 'all',
  categories: [],
  selectedProduct: null,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingCategories: false,
  error: null,

  // In-memory cache for product list queries
  cache: {},
  // In-memory cache for individual product details
  detailCache: {},

  /**
   * Fetch all product categories for the filter dropdown
   */
  fetchCategories: async () => {
    const { categories } = get();
    if (categories.length > 0) return; // Already cached in state

    set({ isLoadingCategories: true });
    try {
      const data = await fetchProductCategories();
      // Normalize categories: DummyJSON can return array of strings or array of { slug, name, url }
      const normalized = (data || []).map((cat) => {
        if (typeof cat === 'string') {
          return { slug: cat, name: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
        }
        return {
          slug: cat.slug || cat.name,
          name: cat.name || cat.slug,
        };
      });

      set({ categories: normalized, isLoadingCategories: false });
    } catch (err) {
      set({
        isLoadingCategories: false,
        error: 'Failed to load product categories',
      });
    }
  },

  /**
   * Fetch products with pagination, search, and category filter
   */
  fetchProducts: async ({
    limit = 10,
    skip = 0,
    query = '',
    category = 'all',
    forceRefresh = false,
  } = {}) => {
    const normalizedQuery = (query || '').trim().toLowerCase();
    const normalizedCat = category || 'all';
    const cacheKey = `products_${limit}_${skip}_${normalizedQuery}_${normalizedCat}`;
    const { cache } = get();

    // Cache hit verification
    if (!forceRefresh && cache[cacheKey]) {
      const cached = cache[cacheKey];
      set({
        products: cached.products,
        total: cached.total,
        limit,
        skip,
        searchQuery: query,
        selectedCategory: category,
        isLoading: false,
        error: null,
      });
      return;
    }

    set({
      isLoading: true,
      error: null,
      limit,
      skip,
      searchQuery: query,
      selectedCategory: category,
    });

    try {
      const data = await fetchProductsList({
        limit,
        skip,
        query: normalizedQuery,
        category: normalizedCat,
      });

      const products = data.products || [];
      const total = data.total || 0;

      set((state) => ({
        products,
        total,
        isLoading: false,
        error: null,
        cache: {
          ...state.cache,
          [cacheKey]: { products, total, limit, skip },
        },
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err?.message || 'Failed to fetch products. Please try again.',
      });
    }
  },

  /**
   * Fetch single product details by ID
   */
  fetchProductById: async (id, forceRefresh = false) => {
    const { detailCache } = get();
    const stringId = String(id);

    if (!forceRefresh && detailCache[stringId]) {
      set({
        selectedProduct: detailCache[stringId],
        isLoadingDetail: false,
        error: null,
      });
      return detailCache[stringId];
    }

    set({ isLoadingDetail: true, error: null, selectedProduct: null });

    try {
      const data = await fetchProductByIdApi(id);
      set((state) => ({
        selectedProduct: data,
        isLoadingDetail: false,
        error: null,
        detailCache: {
          ...state.detailCache,
          [stringId]: data,
        },
      }));
      return data;
    } catch (err) {
      set({
        isLoadingDetail: false,
        error: err?.message || `Failed to fetch product #${id}`,
      });
      return null;
    }
  },

  /**
   * Category filter selection change (resets pagination to first page)
   */
  setCategory: (category) => {
    const { limit, searchQuery, fetchProducts } = get();
    fetchProducts({ limit, skip: 0, query: searchQuery, category });
  },

  /**
   * Search query change (resets pagination to first page)
   */
  setSearchQuery: (query) => {
    const { limit, selectedCategory, fetchProducts } = get();
    fetchProducts({ limit, skip: 0, query, category: selectedCategory });
  },

  /**
   * Page change
   */
  setPage: (newPage) => {
    const { limit, searchQuery, selectedCategory, fetchProducts } = get();
    const newSkip = newPage * limit;
    fetchProducts({
      limit,
      skip: newSkip,
      query: searchQuery,
      category: selectedCategory,
    });
  },

  /**
   * Limit change (page size)
   */
  setRowsPerPage: (newLimit) => {
    const { searchQuery, selectedCategory, fetchProducts } = get();
    fetchProducts({
      limit: newLimit,
      skip: 0,
      query: searchQuery,
      category: selectedCategory,
    });
  },

  clearError: () => set({ error: null }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));

