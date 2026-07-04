import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DailyQuote from '@/components/DailyQuote.vue'

describe('DailyQuote', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('zeigt zunächst den Ladehinweis', () => {
    // fetch löst nie auf -> Komponente bleibt im Ladezustand
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    const wrapper = mount(DailyQuote)

    expect(wrapper.text()).toContain('Tagesmotto wird geladen…')
  })

  it('zeigt Zitat und Autor nach dem Laden', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ q: 'Bleib achtsam.', a: 'beMindful' }],
      }),
    )

    const wrapper = mount(DailyQuote)
    await flushPromises()

    expect(wrapper.text()).toContain('Bleib achtsam.')
    expect(wrapper.text()).toContain('beMindful')
    expect(wrapper.text()).not.toContain('Tagesmotto wird geladen…')
  })

  it('ruft den /quote-Endpoint per GET auf', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ q: 'x', a: 'y' }],
    })
    vi.stubGlobal('fetch', fetchMock)

    mount(DailyQuote)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/quote'),
      expect.objectContaining({ method: 'GET' }),
    )
  })
})
