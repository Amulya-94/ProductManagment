import { useState, useEffect } from "react";
import { api } from "./api";

function Products({ onLogout, role }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query or products change
  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchQuery, products]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Product name cannot be empty");
    if (parseFloat(price) <= 0) return setError("Price must be a positive number");

    setLoading(true);
    setError("");
    try {
      await api.createProduct({ name, price: parseFloat(price), imageUrl });
      setName("");
      setPrice("");
      setImageUrl("");
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditImageUrl(product.imageUrl || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditImageUrl("");
  };

  const handleUpdateProduct = async (id) => {
    if (!editName.trim()) return setError("Product name cannot be empty during edit");
    
    setLoading(true);
    setError("");
    try {
      await api.updateProduct(id, { name: editName, price: parseFloat(editPrice), imageUrl: editImageUrl });
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    setLoading(true);
    setError("");
    try {
      await api.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto", padding: "40px", fontFamily: "'Inter', sans-serif" }}>
      {/* ERROR BAR */}
      {error && (
        <div style={{ backgroundColor: "#d93025", color: "white", padding: "12px 20px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", paddingLeft: "10px" }}>&times;</button>
        </div>
      )}

      {/* HEADER */}
      <header style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#1c1e21", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            {role === "ADMIN" ? "Admin Dashboard" : "Product Catalog"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
            <p style={{ margin: 0, color: "#606770", fontSize: "14px" }}>Inventory Management</p>
            <span style={{ 
              padding: "4px 12px", 
              borderRadius: "20px", 
              fontSize: "11px", 
              fontWeight: "800", 
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backgroundColor: role === "ADMIN" ? "#e7f3ff" : "#f0f2f5", 
              color: role === "ADMIN" ? "#007bff" : "#65676b",
              border: `1px solid ${role === "ADMIN" ? "#d1e7ff" : "#e4e6eb"}`
            }}>
              ● {role} ACCESS
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{ padding: "8px 16px", backgroundColor: "white", color: "#d93025", border: "1px solid #d93025", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s" }}
        >
          Logout
        </button>
      </header>

      {/* ADD PRODUCT FORM - ADMIN ONLY */}
      {role === "ADMIN" && (
        <section style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "30px", border: "1px solid #eef" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "18px", color: "#1c1e21" }}>Add New Product</h3>
          <form onSubmit={handleAddProduct} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            <input
              type="text"
              placeholder="Product Name (e.g. Apple Watch)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              style={{ flex: "2", minWidth: "200px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
            />
            <input
              type="text"
              placeholder="Image URL (e.g. https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
              style={{ flex: "2", minWidth: "200px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              style={{ width: "100px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px 24px", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: loading ? "default" : "pointer", fontWeight: "bold", fontSize: "14px", transition: "0.2s" }}
            >
              {loading ? "Adding..." : "Create Product"}
            </button>
          </form>
        </section>
      )}

      {/* SEARCH AND COUNT */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", padding: "0 4px" }}>
        <div style={{ position: "relative", width: "320px" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", paddingLeft: "40px", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "14px", outline: "none", transition: "border 0.2s" }}
          />
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "16px" }}>🔍</span>
        </div>
        <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#007bff" }}></span>
          Total Products: <span style={{ color: "#1e293b", fontWeight: "800" }}>{filteredProducts.length}</span>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {loading && products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#606770" }}>Loading products...</div>
        ) : currentItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#606770", backgroundColor: "#f9f9f9", borderRadius: "12px" }}>
             {searchQuery ? "No products match your search." : "No products available. Start adding some!"}
          </div>
        ) : (
          currentItems.map((product) => (
            <div key={product.id} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "20px", 
              backgroundColor: "white", 
              border: "1px solid #e2e8f0", 
              borderRadius: "14px", 
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "border 0.2s, box-shadow 0.2s"
            }}>
              {editingId === product.id ? (
                /* INLINE EDIT MODE */
                <div style={{ display: "flex", flex: 1, gap: "10px", alignItems: "center" }}>
                   <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #007bff", fontSize: "14px" }}
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={{ width: "80px", padding: "8px", borderRadius: "6px", border: "1px solid #007bff", fontSize: "14px" }}
                  />
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="Image URL"
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #007bff", fontSize: "14px" }}
                  />
                  <button onClick={() => handleUpdateProduct(product.id)} disabled={loading} style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Save</button>
                  <button onClick={handleCancelEdit} style={{ padding: "8px 12px", backgroundColor: "#f3f3f3", color: "#606770", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Cancel</button>
                </div>
              ) : (
                /* VIEW MODE */
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1 }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "10px", backgroundColor: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                      <img 
                        src={product.imageUrl || "https://placehold.co/150x150?text=No+Image"} 
                        alt={product.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "https://placehold.co/150x150?text=Error"; }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontWeight: "700", fontSize: "18px", color: "#0f172a" }}>{product.name}</span>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ 
                          color: "#166534", 
                          backgroundColor: "#f0fdf4", 
                          padding: "4px 10px", 
                          borderRadius: "6px", 
                          fontSize: "15px", 
                          fontWeight: "700",
                          border: "1px solid #dcfce7"
                        }}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {role === "ADMIN" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleStartEdit(product)}
                        disabled={loading}
                        style={{ padding: "8px 16px", backgroundColor: "#f3f3f3", color: "#1c1e21", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        disabled={loading}
                        style={{ padding: "8px 16px", backgroundColor: "#fff0f0", color: "#d93025", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: currentPage === 1 ? "#fafafa" : "white", cursor: currentPage === 1 ? "default" : "pointer", fontSize: "14px" }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#606770" }}>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: currentPage === totalPages ? "#fafafa" : "white", cursor: currentPage === totalPages ? "default" : "pointer", fontSize: "14px" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
