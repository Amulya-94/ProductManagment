import { useState, useEffect } from "react";
import { api } from "./api";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check if we redirected here due to expiry
    const expired = localStorage.getItem("session_expired");
    if (expired) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("session_expired");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, role } = await api.loginAdmin(username, password);
      setSuccessMsg("Login successful! Redirecting...");
      
      // Delay slightly for UX
      setTimeout(() => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setToken(token, role);
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", width: "100%" }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        padding: "40px", 
        borderRadius: "16px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
        background: "white",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "10px", color: "#1c1e21", fontSize: "28px" }}>Product Portal</h2>
        <p style={{ color: "#606770", marginBottom: "30px" }}>Enter your credentials to continue</p>
        
        {error && (
          <div style={{ backgroundColor: "#ffeef0", color: "#d93025", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #f5c2c7" }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: "#e6f4ea", color: "#1e8e3e", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #c3e6cb" }}>
            {successMsg}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#4b4b4b" }}>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", outline: "none" }}
            />
          </div>
          
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#4b4b4b" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: "14px", 
              borderRadius: "8px", 
              border: "none", 
              backgroundColor: loading ? "#ccc" : "#007bff", 
              color: "white", 
              fontWeight: "bold", 
              fontSize: "16px",
              cursor: loading ? "default" : "pointer",
              transition: "background-color 0.2s",
              marginTop: "10px"
            }}
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
