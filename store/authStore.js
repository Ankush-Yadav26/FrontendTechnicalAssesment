/**
 * Authentication Store using Zustand with Persistence.
 * 
 * WHY ZUSTAND WAS CHOSEN:
 * 1. Simplicity & Minimal Footprint: Zustand has an extremely small bundle footprint (< 1KB)
 *    compared to Redux Toolkit (~15KB) or other heavy state managers.
 * 2. Zero Boilerplate: No need for providers, reducers, action creators, or dispatchers.
 * 3. Native Asynchronous Actions: Async functions run directly inside the store without requiring
 *    external middlewares like Redux Thunk or Redux Saga.
 * 4. Flexible Persistence: First-class support for localStorage synchronization through the `persist` middleware.
 * 5. Optimal for Next.js & React: Selectors allow fine-grained subscriptions that prevent unnecessary re-renders.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loginUser } from '@/services/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      /**
       * Asynchronous Login Action:
       * Communicates with DummyJSON auth endpoint.
       * Updates user credentials, auth token, and sets isAuthenticated on success.
       */
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginUser(username, password);
          const token = data.accessToken || data.token;
          
          set({
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              gender: data.gender,
              image: data.image,
            },
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user: data };
        } catch (err) {
          const message = err?.message || 'Invalid username or password';
          set({
            isLoading: false,
            error: message,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          return { success: false, error: message };
        }
      },

      /**
       * Logout Action:
       * Clears authenticated session and tokens from both memory and persisted localStorage.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      clearError: () => set({ error: null }),
      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => () => {
        // Hydration finished (guarantee flag is flipped to avoid hanging screens)
        useAuthStore.setState({ isHydrated: true });
      },
    }
  )
);
