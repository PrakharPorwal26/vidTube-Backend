import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors
    try {
      await api.post("/users/login", { email, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("🔴 Login error full:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed";
      setError(serverMsg);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2 className="mb-4 text-center text-danger">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">
          Login
        </button>
      </form>
    </div>
  );
}
