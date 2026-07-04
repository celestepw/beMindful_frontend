import { authHeader } from '@/auth'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

export interface Profile {
  username: string
  email: string
}

/** Lädt die Konto-Infos des angemeldeten Nutzers. */
export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(baseUrl + '/api/user/me', {
    headers: { ...authHeader() },
  })
  if (!res.ok) throw new Error('Profil konnte nicht geladen werden.')
  return res.json()
}

/** Ändert das Passwort (das Backend prüft das aktuelle Passwort). */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(baseUrl + '/api/user/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || 'Passwort konnte nicht geändert werden.')
  }
}
