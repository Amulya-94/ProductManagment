const BASE_URL = "http://localhost:8080";

const request = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("session_expired", "true");
    window.location.reload(); 
    throw new Error("Session expired. Please login again.");
  }

  if (response.status === 403) {
    throw new Error("You do not have permission to perform this action.");
  }

  return response;
};

export const api = {
  loginAdmin: async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Invalid credentials");
    
    // Backend returns JSON: { token, role }
    return await response.json();
  },

  fetchProducts: async () => {
    const response = await request("/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  },

  createProduct: async (product) => {
    const response = await request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to add product");
    return await response.json();
  },

  updateProduct: async (id, product) => {
    const response = await request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  },

  deleteProduct: async (id) => {
    const response = await request(`/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    // DELETE /products/{id} returns a plain string, but we can just check ok
    return true;
  },
};
