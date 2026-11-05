/**
 * API Service layer for DummyJSON REST endpoints.
 * Uses standard Fetch API to adhere to strict minimal dependency requirements.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Generic helper for HTTP requests with error handling, timeout, and auth injection
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // Create AbortController for network timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // If token is explicitly passed, attach Authorization header
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      const timeoutError = new Error('Network request timed out. Please check your connection.');
      timeoutError.status = 408;
      throw timeoutError;
    }

    if (!error.status) {
      error.status = 500;
    }
    throw error;
  }
}

/**
 * Authentication Endpoints
 */
export async function loginUser(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });
}

/**
 * User Management Endpoints
 */
export async function fetchUsersList({ limit = 10, skip = 0, query = '' } = {}) {
  if (query && query.trim()) {
    const encoded = encodeURIComponent(query.trim());
    return request(`/users/search?q=${encoded}&limit=${limit}&skip=${skip}`);
  }
  return request(`/users?limit=${limit}&skip=${skip}`);
}

export async function fetchUserById(id) {
  return request(`/users/${id}`);
}

/**
 * Product Management Endpoints
 */
export async function fetchProductsList({ limit = 10, skip = 0, query = '', category = '' } = {}) {
  // If search query is provided, DummyJSON search endpoint takes precedence
  if (query && query.trim()) {
    const encoded = encodeURIComponent(query.trim());
    return request(`/products/search?q=${encoded}&limit=${limit}&skip=${skip}`);
  }

  // If a category filter is selected
  if (category && category !== 'all') {
    const encodedCat = encodeURIComponent(category);
    return request(`/products/category/${encodedCat}?limit=${limit}&skip=${skip}`);
  }

  // Default standard list with pagination
  return request(`/products?limit=${limit}&skip=${skip}`);
}

export async function fetchProductCategories() {
  return request('/products/categories');
}

export async function fetchProductById(id) {
  return request(`/products/${id}`);
}
