import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FaUserPlus,
  FaUser,
  FaLock,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
} from 'react-icons/fa'
import { ALL_ROLES, ROLE_LABELS } from '../auth/roles'
import Button from '../components/ui/Button'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: ALL_ROLES[0],
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Password dan Confirm Password tidak sama')
      return
    }

    // ⛔ dummy (nanti ganti API)
    console.log('REGISTER:', form)

    navigate('/login')
  }

  const isDisabled =
    !form.fullName ||
    !form.username ||
    !form.email ||
    !form.password ||
    !form.confirmPassword

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E60012]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#2E3048]/10 to-transparent rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E60012] to-[#B00010] shadow-xl mb-4">
            <FaUserPlus className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-semibold text-neutral-800 mb-2">
            Create Account
          </h1>
          <p className="text-neutral-500">
            Register to access Key Account Management System
          </p>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-5 bg-white/95"
        >
          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Full Name */}
          <Field
            label="Full Name"
            icon={<FaIdBadge />}
            placeholder="Your full name"
            value={form.fullName}
            onChange={(v) => update('fullName', v)}
          />

          {/* Username */}
          <Field
            label="Username"
            icon={<FaUser />}
            placeholder="Choose a username"
            value={form.username}
            onChange={(v) => update('username', v)}
          />

          {/* Email */}
          <Field
            label="Email"
            type="email"
            icon={<FaEnvelope />}
            placeholder="you@company.com"
            value={form.email}
            onChange={(v) => update('email', v)}
          />

          {/* Phone */}
          <Field
            label="Phone Number (Optional)"
            icon={<FaPhone />}
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={(v) => update('phone', v)}
          />

          {/* Role */}
          <label className="block">
            <span className="text-sm font-medium text-neutral-700 mb-2 block">
              Role
            </span>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <FaLock />
              </div>
              <select
                className="w-full border-2 border-neutral-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#E60012] focus:ring-4 focus:ring-[#E60012]/10 cursor-pointer"
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r] || r}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {/* Role badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Selected role:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#E60012]/30 text-[#B00010] bg-[#E60012]/10">
              {ROLE_LABELS[form.role] || form.role}
            </span>
          </div>

          {/* Password */}
          <Field
            label="Password"
            type="password"
            icon={<FaLock />}
            placeholder="Create password"
            value={form.password}
            onChange={(v) => update('password', v)}
          />

          {/* Confirm Password */}
          <Field
            label="Confirm Password"
            type="password"
            icon={<FaLock />}
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={(v) => update('confirmPassword', v)}
          />

          {/* REGISTER BUTTON */}
          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-gradient-to-r from-[#E60012] to-[#B00010] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            Register
            <FaArrowRight />
          </Button>

          {/* Footer */}
          <div className="pt-3 border-t text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#E60012] font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          © 2025. All rights reserved.
        </p>
      </div>
    </div>
  )
}

/* ====================== REUSABLE FIELD ====================== */
function Field({ label, icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700 mb-2 block">
        {label}
      </span>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </div>
        <input
          type={type}
          className="w-full border-2 border-neutral-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#E60012] focus:ring-4 focus:ring-[#E60012]/10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={label !== 'Phone Number (Optional)'}
        />
      </div>
    </label>
  )
}
