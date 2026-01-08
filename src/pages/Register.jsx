import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserPlus, FaUser, FaLock, FaArrowRight,
  FaEnvelope, FaPhone, FaIdBadge
} from "react-icons/fa";
import Button from "../components/ui/Button";
import { getManagers, register } from "../services/authService";

export default function Register() {

  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",

    manager_id: "",
    region: "",
    witel: "",
    idSales: "",
    tipe: "",
    kuadran: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 LOAD DATA MANAGER (dropdown)
  useEffect(() => {
    async function loadManagers() {
      try {
        const data = await getManagers();
        setManagers(data);
      } catch (e) {
        console.error("Gagal load manager", e);
        setManagers([]);
      }
    }

    loadManagers();
  }, []);

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      await register(form);

      if (form.role === "manager") {
        alert("Akun Anda dikirim ke ADMIN untuk approval");
      } else if (form.role === "account_manager" || form.role === "sales") {
        alert("Akun Anda dikirim ke MANAGER untuk approval");
      }

      setSuccess("Registrasi berhasil");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-4">

          <h2 className="text-xl font-semibold text-center">Create Account</h2>

          {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-2 rounded">{success}</div>}

          <Field label="Full Name" icon={<FaIdBadge />} value={form.fullName} onChange={v => update("fullName", v)} />
          <Field label="Username" icon={<FaUser />} value={form.username} onChange={v => update("username", v)} />
          <Field label="Email" type="email" icon={<FaEnvelope />} value={form.email} onChange={v => update("email", v)} />
          <Field label="Phone" icon={<FaPhone />} value={form.phone} onChange={v => update("phone", v)} />

          {/* ROLE */}
          <label className="block">
            Role
            <select
              className="w-full border rounded p-3"
              value={form.role}
              onChange={e => update("role", e.target.value)}
              required
            >
              <option value="">-- pilih --</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="account_manager">Account Manager</option>
              <option value="sales">Sales</option>
            </select>
          </label>

          {/* 🔹 DROPDOWN MANAGER HANYA UNTUK AM/SALES */}
          {(form.role === "account_manager" || form.role === "sales") && (
            <>
              <label className="block">
                Pilih Manager
                <select
                  className="w-full border rounded p-3"
                  value={form.manager_id}
                  onChange={e => update("manager_id", e.target.value)}
                  required
                >
                  <option value="">-- pilih manager --</option>

                  {managers.map(m => (
                    <option key={m.user_id} value={m.user_id}>
                      ({m.nik_mgr})
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <Field label="Password" type="password" icon={<FaLock />} value={form.password} onChange={v => update("password", v)} />
          <Field label="Confirm Password" type="password" icon={<FaLock />} value={form.confirmPassword} onChange={v => update("confirmPassword", v)} />

          <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded">
            Register
          </Button>

        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", icon }) {
  return (
    <label className="block">
      {label}
      <div className="relative">
        {icon && <div className="absolute left-3 top-3">{icon}</div>}
        <input
          type={type}
          className={`w-full border rounded p-3 ${icon ? "pl-9" : ""}`}
          value={value}
          onChange={e=>onChange(e.target.value)}
        />
      </div>
    </label>
  );
}
