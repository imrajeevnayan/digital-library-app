import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import MyLoans from './pages/MyLoans'
import Categories from './pages/Categories'
import AdminUsers from './pages/AdminUsers'
import AdminLoans from './pages/AdminLoans'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="my-loans" element={<MyLoans />} />
        <Route path="categories" element={<Categories />} />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/loans"
          element={
            <ProtectedRoute adminOnly>
              <AdminLoans />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
