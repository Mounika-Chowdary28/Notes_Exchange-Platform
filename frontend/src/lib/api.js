import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

export const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const hasBackend = Boolean(baseURL)
