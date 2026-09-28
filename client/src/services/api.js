const API_BASE = '/api';

// Token helpers
export const getToken = () => localStorage.getItem('artflow_token');
export const setToken = (token) => localStorage.setItem('artflow_token', token);
export const removeToken = () => localStorage.removeItem('artflow_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('artflow_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('artflow_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('artflow_user');

// Generic request helper with Auth header
async function request(endpoint, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if body is FormData (let browser set boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

// Authentication API
export const authApi = {
  register: async (userId, email, password) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        email,
        password,
      }),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  login: async (identifier, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  getMe: async () => {
    return request('/auth/me');
  },

  logout: () => {
    removeToken();
    removeStoredUser();
  },
};

// Tutorial & Studio API
export const tutorialApi = {
  generate: async (formData) => {
    return request('/tutorials/generate', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async () => {
    return request('/tutorials');
  },

  getById: async (id) => {
    return request(`/tutorials/${id}`);
  },

  saveDrawing: async (id, canvasData, previewDataUrl) => {
    return request(`/tutorials/${id}/save-drawing`, {
      method: 'POST',
      body: JSON.stringify({
        canvasData,
        previewDataUrl,
      }),
    });
  },

  delete: async (id) => {
    return request(`/tutorials/${id}`, {
      method: 'DELETE',
    });
  },
};
