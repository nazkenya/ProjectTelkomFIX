import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const user = await login(username, password);

        // pastikan role pasti ada
        if (!user?.role) {
          throw new Error("Role tidak ditemukan pada akun ini");
        }

        // simpan ke AuthContext
        setUser({
          id: user.id,
          name: user.nama_lengkap || user.username,
          email: user.email,
          role: user.role,
        });

        // redirect berdasarkan role
        switch (user.role) {
          case "admin":
            navigate("/executive");
            break;

          case "manager":
            navigate("/manager");
            break;

          case "account_manager":
          case "sales":
            navigate("/");
            break;

          default:
            navigate("/");
        }
      } 
      catch (err) {
            setError(err.message || "Terjadi kesalahan saat login");
          } finally {
            setLoading(false);
          }
        }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-5">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E60012] to-[#B00010] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
            <FaArrowRight />
          </button>

          <div className="pt-4 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-500">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#E60012] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          © 2025. All rights reserved.
        </p>
      </div>
    </div>
  );
}
