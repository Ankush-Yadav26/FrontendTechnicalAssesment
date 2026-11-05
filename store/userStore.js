/**
 * Users Store with API-side Pagination and Client-Side In-Memory Caching.
 * 
 * WHY ZUSTAND WAS CHOSEN:
 * - Direct state reads and asynchronous mutators without verbose reducer boilerplate.
 * - Selective rendering: components subscribing to specific properties (e.g. `isLoading`, `users`)
 *   only re-render when those specific values change.
 * - Simple integration with React hooks (`useUserStore`).
 * 
 * HOW ASYNCHRONOUS ACTIONS WORK:
 * - Async functions inside the store call the API services using native `fetch`.
 * - While the network request is pending, `isLoading` is set to true.
 * - A monotonically increasing `lastRequestId` is maintained to prevent race conditions:
 *   if an older request finishes after a newer one, the stale response is automatically discarded.
 * - Upon resolution, the store writes the fetched data to state and updates the cache.
 * 
 * WHY CACHING IS USEFUL & CACHING STRATEGY IMPLEMENTED:
 * - Avoids repetitive round-trips to the server when users paginate back-and-forth or repeat search terms.
 * - Reduces network bandwidth and produces an instantaneous, snappy UI response.
 * - Strategy: A hash-map dictionary `cache[cacheKey]` where `cacheKey = users_${limit}_${skip}_${query}`.
 *   If a request with identical parameters has already been loaded, the cached payload is used immediately.
 * 
 * HOW API-SIDE PAGINATION WORKS:
 * - DummyJSON expects `limit` (number of records per page) and `skip` (number of records to bypass).
 * - For page 1: skip = 0; page 2: skip = limit; page N: skip = (page - 1) * limit.
 * - The server returns `users` and `total` count. The total is used by the MUI TablePagination
 *   component to calculate total pages and render pagination controls.
 */

import { create } from 'zustand';
import { fetchUsersList, fetchUserById as fetchUserByIdApi } from '@/services/api';

export const useUserStore = create((set, get) => ({
  users: [],
  total: 0,
  limit: 10,
  skip: 0,
  searchQuery: '',
  selectedUser: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  lastRequestId: 0,

  // Client-side cache: { [cacheKey]: { users, total, limit, skip } }
  cache: {},
  // Detail cache: { [userId]: userObject }
  detailCache: {},

  /**
   * Fetch users with pagination and search filtering.
   * Checks the in-memory cache first to avoid unnecessary network calls.
   * Employs request ID tracking to prevent race conditions.
   */
  fetchUsers: async ({ limit, skip, query, forceRefresh = false } = {}) => {
    const currentLimit = limit ?? get().limit;
    const currentSkip = skip ?? get().skip;
    const currentQuery = query !== undefined ? query : get().searchQuery;

    const normalizedQuery = (currentQuery || '').trim().toLowerCase();
    const cacheKey = `users_${currentLimit}_${currentSkip}_${normalizedQuery}`;
    const { cache } = get();

    // Check cache hit if forceRefresh is not requested
    if (!forceRefresh && cache[cacheKey]) {
      const cached = cache[cacheKey];
      set({
        users: cached.users,
        total: cached.total,
        limit: currentLimit,
        skip: currentSkip,
        searchQuery: currentQuery,
        isLoading: false,
        error: null,
      });
      return;
    }

    const requestId = (get().lastRequestId || 0) + 1;
    set({
      lastRequestId: requestId,
      isLoading: true,
      error: null,
      limit: currentLimit,
      skip: currentSkip,
      searchQuery: currentQuery,
    });

    try {
      const data = await fetchUsersList({
        limit: currentLimit,
        skip: currentSkip,
        query: normalizedQuery,
      });

      // Discard response if a newer request was dispatched while this was pending
      if (get().lastRequestId !== requestId) {
        return;
      }

      const users = data.users || [];
      const total = data.total || 0;

      // Update state and cache
      set((state) => ({
        users,
        total,
        isLoading: false,
        error: null,
        cache: {
          ...state.cache,
          [cacheKey]: { users, total, limit: currentLimit, skip: currentSkip },
        },
      }));
    } catch (err) {
      if (get().lastRequestId !== requestId) return;

      set({
        isLoading: false,
        error: err?.message || 'Failed to fetch users. Please try again.',
      });
    }
  },

  /**
   * Fetch single user details by ID.
   * Checks detailCache first.
   */
  fetchUserById: async (id, forceRefresh = false) => {
    const { detailCache } = get();
    const stringId = String(id);

    if (!forceRefresh && detailCache[stringId]) {
      set({
        selectedUser: detailCache[stringId],
        isLoadingDetail: false,
        error: null,
      });
      return detailCache[stringId];
    }

    set({ isLoadingDetail: true, error: null, selectedUser: null });

    try {
      const data = await fetchUserByIdApi(id);
      set((state) => ({
        selectedUser: data,
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
        error: err?.message || `Failed to fetch user #${id}`,
      });
      return null;
    }
  },

  /**
   * Change current page in pagination
   */
  setPage: (newPage) => {
    const { limit, searchQuery, fetchUsers } = get();
    const newSkip = newPage * limit;
    fetchUsers({ limit, skip: newSkip, query: searchQuery });
  },

  /**
   * Change page size (limit)
   */
  setRowsPerPage: (newLimit) => {
    const { searchQuery, fetchUsers } = get();
    fetchUsers({ limit: newLimit, skip: 0, query: searchQuery });
  },

  /**
   * Search users (resets pagination to first page)
   */
  setSearchQuery: (query) => {
    const { limit, fetchUsers } = get();
    fetchUsers({ limit, skip: 0, query });
  },

  clearError: () => set({ error: null }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));
