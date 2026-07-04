import { reactive, watch, watchEffect } from 'vue'

export interface Preferences {
  defaultPattern: string
  defaultCycles: number
  darkMode: boolean
}

const STORAGE_KEY = 'bemindful-prefs'
const defaults: Preferences = { defaultPattern: 'calm', defaultCycles: 3, darkMode: false }

function load(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<Preferences>) }
  } catch {
    // Ungültige/leere Daten – Standardwerte verwenden
  }
  return { ...defaults }
}

// Reaktive App-Einstellungen; werden bei jeder Änderung in localStorage gespeichert.
export const preferences = reactive<Preferences>(load())

watch(
  preferences,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

// Dark-Mode als Klasse am <html>-Element setzen (wirkt global & schon beim Laden).
watchEffect(() => {
  document.documentElement.classList.toggle('dark', preferences.darkMode)
})
