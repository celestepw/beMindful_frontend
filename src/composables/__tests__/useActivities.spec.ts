import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useActivities } from '@/composables/useActivities'
import type { Exercise } from '@/types'

const { items, streak, loadActivities, loadStreak, addActivity, deleteActivity } = useActivities()

function exercise(partial: Partial<Exercise> & { id: number }): Exercise {
  return { title: 'Test', mood: 'gut', done: true, date: '2026-06-30', ...partial }
}

describe('useActivities', () => {
  beforeEach(() => {
    // gemeinsamer Modul-Zustand -> vor jedem Test zurücksetzen
    items.value = []
    streak.value = 0
    vi.restoreAllMocks()
  })

  it('loadActivities füllt items bei erfolgreicher Antwort', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [exercise({ id: 1, title: 'Atemübung' })],
      }),
    )

    await loadActivities()

    expect(items.value).toHaveLength(1)
    expect(items.value[0]?.title).toBe('Atemübung')
  })

  it('loadStreak übernimmt den Wert vom Backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => 5 }))

    await loadStreak()

    expect(streak.value).toBe(5)
  })

  it('addActivity hängt den gespeicherten Eintrag an items an', async () => {
    const saved = exercise({ id: 2, title: 'Journal' })
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => saved }) // POST /activities
      .mockResolvedValueOnce({ ok: true, json: async () => 1 }) // anschließendes loadStreak
    vi.stubGlobal('fetch', fetchMock)

    await addActivity({ title: 'Journal', mood: 'gut' })

    expect(items.value.some((i) => i.id === 2)).toBe(true)
  })

  it('deleteActivity entfernt den Eintrag aus items', async () => {
    items.value = [exercise({ id: 1 }), exercise({ id: 2 })]
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true }) // DELETE /activities/1
      .mockResolvedValueOnce({ ok: true, json: async () => 0 }) // anschließendes loadStreak
    vi.stubGlobal('fetch', fetchMock)

    await deleteActivity(1)

    expect(items.value.map((i) => i.id)).toEqual([2])
  })
})
