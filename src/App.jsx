// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify' // ✅ Tambahkan import ini
import 'react-toastify/dist/ReactToastify.css' // ✅ Tambahkan import CSS ini
import { routes } from './routes/routeConfig'
import Layout from './components/layout/Layout'
import RequireAuth from './auth/RequireAuth'
import RequireRole from './auth/RequireRole'

export default function App() {
  return (
    // Wrapper untuk zoom seluruh aplikasi
    <div className="app-zoom-90">
      <Routes>
        {/* Public routes */}
        {routes.filter(r => r.public).map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}

        {/* Protected routes with layout */}
        <Route element={<Layout />}>
          <Route element={<RequireAuth />}>
            {routes.filter(r => !r.public).map(r => (
              <Route key={r.path} element={<RequireRole allowed={r.roles} />}>
                <Route path={r.path} element={r.element} />
              </Route>
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
      
      {/* ✅ LETAKKAN TOASTCONTAINER DI SINI - SETELAH ROUTES */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}