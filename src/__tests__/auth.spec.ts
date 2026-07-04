import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authState, authHeader, login, logout, register } from '@/auth'

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear()
    authState.token = null
    authState.isAuthenticated = false
    vi.restoreAllMocks()
  })

  it('authHeader ist leer ohne Token', () => {
    expect(authHeader()).toEqual({})
  })

  it('authHeader enthält Bearer-Token wenn eingeloggt', () => {
    authState.token = 'abc'
    expect(authHeader()).toEqual({ Authorization: 'Bearer abc' })
  })

  it('login speichert Token in State und localStorage', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'jwt-123' }),
      }),
    )

    await login('celeste', 'geheim')

    expect(authState.token).toBe('jwt-123')
    expect(authState.isAuthenticated).toBe(true)
    expect(localStorage.getItem('token')).toBe('jwt-123')
  })

  it('login wirft "Falsche Zugangsdaten" bei 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

    await expect(login('celeste', 'falsch')).rejects.toThrow('Falsche Zugangsdaten')
    expect(authState.isAuthenticated).toBe(false)
  })

  it('logout entfernt Token aus State und localStorage', () => {
    authState.token = 'abc'
    authState.isAuthenticated = true
    localStorage.setItem('token', 'abc')

    logout()

    expect(authState.token).toBeNull()
    expect(authState.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('register gibt den Erfolgstext des Backends zurück', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: async () => 'Registriert' }),
    )

    await expect(register('celeste', 'c@example.com', 'geheim')).resolves.toBe('Registriert')
  })
})
