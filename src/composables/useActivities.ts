import { ref, type Ref } from 'vue'
import type { Exercise } from '@/types'
import { authHeader } from '@/auth'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

// Modul-weiter (geteilter) Zustand – alle Komponenten sehen dieselben Daten.
const items: Ref<Exercise[]> = ref([])
const streak = ref(0)
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function loadActivities() {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await fetch(baseUrl + '/activities', {
      method: 'GET',
      headers: { ...authHeader() },
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    items.value = await res.json()
  } catch (e) {
    errorMsg.value = 'Aktivitäten konnten nicht geladen werden.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadStreak() {
  try {
    const res = await fetch(baseUrl + '/streak', {
      method: 'GET',
      headers: { ...authHeader() },
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    streak.value = await res.json()
  } catch (e) {
    console.error(e)
  }
}

async function addActivity(input: { title: string; mood: string; done?: boolean; note?: string }) {
  const res = await fetch(baseUrl + '/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({
      title: input.title,
      mood: input.mood,
      done: input.done ?? true,
      note: input.note ?? null,
    }),
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const saved: Exercise = await res.json()
  items.value.push(saved)
  await loadStreak()
  return saved
}

async function updateActivity(
  id: number,
  input: { title: string; mood: string; done: boolean; note?: string },
) {
  const res = await fetch(baseUrl + '/activities/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const updated: Exercise = await res.json()
  const idx = items.value.findIndex((i) => i.id === id)
  if (idx !== -1) items.value[idx] = updated
  await loadStreak()
  return updated
}

async function deleteActivity(id: number) {
  const res = await fetch(baseUrl + '/activities/' + id, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  items.value = items.value.filter((i) => i.id !== id)
  await loadStreak()
}

export function useActivities() {
  return {
    items,
    streak,
    loading,
    errorMsg,
    loadActivities,
    loadStreak,
    addActivity,
    updateActivity,
    deleteActivity,
  }
}
