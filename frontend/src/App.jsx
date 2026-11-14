import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import InstituteLayout from './layouts/InstituteLayout'
import ReviewerLayout from './layouts/ReviewerLayout'
import AdminLayout from './layouts/AdminLayout'

import InstituteDashboard from './pages/institute/Dashboard'
import InstituteApplicationsList from './pages/institute/ApplicationsList'
import NewApplication from './pages/institute/NewApplication'
import InstituteApplicationDetail from './pages/institute/ApplicationDetail'
import InstituteProfile from './pages/institute/Profile'

import ReviewerDashboard from './pages/reviewer/Dashboard'
import ReviewerApplicationsList from './pages/reviewer/ApplicationsList'
import ReviewerApplicationDetail from './pages/reviewer/ApplicationDetail'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsersList from './pages/admin/UsersList'
import AdminApplicationsList from './pages/admin/ApplicationsList'

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    if (role === 'INSTITUTE') return <Navigate to="/institute" replace />
    if (role === 'REVIEWER') return <Navigate to="/reviewer" replace />
    if (role === 'ADMIN') return <Navigate to="/admin" replace />
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Institute Routes */}
      <Route
        path="/institute/*"
        element={
          <ProtectedRoute requiredRole="INSTITUTE">
            <InstituteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InstituteDashboard />} />
        <Route path="applications" element={<InstituteApplicationsList />} />
        <Route path="applications/new" element={<NewApplication />} />
        <Route path="applications/:id" element={<InstituteApplicationDetail />} />
        <Route path="profile" element={<InstituteProfile />} />
      </Route>

      {/* Reviewer Routes */}
      <Route
        path="/reviewer/*"
        element={
          <ProtectedRoute requiredRole="REVIEWER">
            <ReviewerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReviewerDashboard />} />
        <Route path="applications" element={<ReviewerApplicationsList />} />
        <Route path="applications/:id" element={<ReviewerApplicationDetail />} />
        <Route path="completed" element={<ReviewerApplicationsList completed />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersList />} />
        <Route path="applications" element={<AdminApplicationsList />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
