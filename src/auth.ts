import { reactive } from 'vue'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export const authState: AuthState = reactive({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token')
})

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string

export async function register(username: string, email: string, password: string): Promise<string> {
  const res = await fetch(BASE_URL + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Registrierung fehlgeschlagen')
  }
  return res.text()
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(BASE_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    throw new Error('Falsche Zugangsdaten')
  }
  const data: { token: string } = await res.json()
  authState.token = data.token
  authState.isAuthenticated = true
  localStorage.setItem('token', data.token)
}

export function logout(): void {
  authState.token = null
  authState.isAuthenticated = false
  localStorage.removeItem('token')
}

export function authHeader(): Record<string, string> {
  return authState.token ? { Authorization: `Bearer ${authState.token}` } : {}
}
