import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// ── Pages ──
import SVSLogin from './pages/SVSLogin'
import SVSAdminDashboard from './pages/SVSAdminDashboard'
import SVSBatchHistory from './pages/SVSBatchHistory'
import SVSVerifyProduct from './pages/SVSVerifyProduct'

// ── Auth guard ──
function ProtectedRoute({ children }) {
  return localStorage.getItem('svs_token')
    ? children
    : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* On opening, login page is shown */}
        <Route path="/" element={<SVSLogin />} />
        
        {/* Admin Secured Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <SVSAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/batch-history"
          element={
            <ProtectedRoute>
              <SVSBatchHistory />
            </ProtectedRoute>
          }
        />

        {/* QR scan landing page */}
        <Route path="/verify/:labelNumber" element={<SVSVerifyProduct />} />

        {/* Fallback to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}