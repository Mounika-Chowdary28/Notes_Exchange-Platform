import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect on auth state change
    if (!isAuthenticated) {
      navigate('/auth', { replace: true, state: { from: location.pathname } })
    }
  }, [isAuthenticated, navigate, location.pathname])

  if (!isAuthenticated) {
    return null // Return null while redirecting
  }

  if (roles?.length && !roles.includes(user?.role)) {
    navigate('/', { replace: true })
    return null
  }

  return children
}
