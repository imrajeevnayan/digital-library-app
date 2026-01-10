import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/v1/auth/user')
      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loginWithOAuth = (provider) => {
    window.location.href = `/oauth2/authorization/${provider}`
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      window.location.href = '/'
    }
  }

  const value = {
    user,
    loading,
    loginWithOAuth,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
