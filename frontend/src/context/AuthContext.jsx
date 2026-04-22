import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAuthToken } from '../lib/api'

const AuthContext = createContext(null)

const AUTH_KEY = 'nex_auth'
const REMEMBER_KEY = 'nex_remember'

function readSession() {
  try {
    const s = sessionStorage.getItem(AUTH_KEY)
    if (s) return JSON.parse(s)
  } catch {
    /* ignore */
  }
  return null
}

function readLocal() {
  try {
    const s = localStorage.getItem(AUTH_KEY)
    if (s) return JSON.parse(s)
  } catch {
    /* ignore */
  }
  return null
}

function readStored() {
  return readSession() || readLocal()
}

function persistSession(session, remember) {
  sessionStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(AUTH_KEY)
  if (!session) {
    localStorage.removeItem(REMEMBER_KEY)
    return
  }
  const raw = JSON.stringify(session)
  if (remember) {
    localStorage.setItem(AUTH_KEY, raw)
    localStorage.setItem(REMEMBER_KEY, '1')
    sessionStorage.removeItem(AUTH_KEY)
  } else {
    sessionStorage.setItem(AUTH_KEY, raw)
    localStorage.setItem(REMEMBER_KEY, '0')
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStored())

  useEffect(() => {
    if (session?.token) setAuthToken(session.token)
    else setAuthToken(null)
  }, [session?.token])

  const login = useCallback(async (email, password, options = {}) => {
    const { rememberMe = true } = options
    try {
      const response = await api.post('/auth/login', { email, password })
      const { data } = response.data
      const user = { ...data.user, id: data.user._id || data.user.id }
      const next = { token: data.token, user }
      persistSession(next, rememberMe)
      setAuthToken(next.token)
      setSession(next)
      return next
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }, [])

  const signup = useCallback(async (name, email, password, profile = {}) => {
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        branch: profile.branch || 'CSE',
        semester: profile.semester || 1
      })
      const { data } = response.data
      const user = { ...data.user, id: data.user._id || data.user.id }
      const next = { token: data.token, user }
      persistSession(next, profile.rememberMe !== false)
      setAuthToken(next.token)
      setSession(next)
      return next
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed')
    }
  }, [])

  const updateProfile = useCallback((patch) => {
    setSession((prev) => {
      if (!prev?.user) return prev
      const user = { ...prev.user, ...patch }
      const next = { ...prev, user }
      const remember = localStorage.getItem(REMEMBER_KEY) !== '0'
      persistSession(next, remember)
      return next
    })
  }, [])

  const logout = useCallback(() => {
    persistSession(null, false)
    setAuthToken(null)
    setSession(null)
  }, [])

  /** Demo forgot-password: stores a short code clientside */
  const requestPasswordReset = useCallback((email) => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const key = `nex_reset_${btoa(email.trim().toLowerCase())}`
    localStorage.setItem(
      key,
      JSON.stringify({ code, exp: Date.now() + 1000 * 60 * 30 })
    )
    return code
  }, [])

  const resetPassword = useCallback((email, code, newPassword) => {
    void newPassword
    const key = `nex_reset_${btoa(email.trim().toLowerCase())}`
    const raw = localStorage.getItem(key)
    if (!raw) return { ok: false, error: 'No reset request found.' }
    try {
      const row = JSON.parse(raw)
      if (row.exp < Date.now()) return { ok: false, error: 'Code expired.' }
      if (String(row.code) !== String(code)) return { ok: false, error: 'Invalid code.' }
      localStorage.removeItem(key)
      return { ok: true }
    } catch {
      return { ok: false, error: 'Invalid state.' }
    }
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.user?.role === 'admin',
      login,
      signup,
      logout,
      updateProfile,
      requestPasswordReset,
      resetPassword,
    }),
    [session, login, signup, logout, updateProfile, requestPasswordReset, resetPassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
