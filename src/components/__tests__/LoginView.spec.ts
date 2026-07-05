import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'

// push-Mock hoisten, damit er innerhalb der vi.mock-Factory nutzbar ist
// und wir im Test prüfen können, wohin navigiert wurde.
const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))

// useRouter() wird in LoginView aufgerufen – hier mocken, damit kein echter
// Router installiert werden muss.
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Standard-fetch-Mock (erfolgreich) – so wird kein echtes Backend gebraucht.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'test-token' }),
      }),
    )
  })

  it('rendert Username- und Passwort-Input', () => {
    const wrapper = shallowMount(LoginView)
    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('zeigt den "Einloggen"-Button', () => {
    const wrapper = shallowMount(LoginView)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Einloggen')
  })

  it('zeigt "Falsche Zugangsdaten" bei einer 401-Response', async () => {
    // fetch liefert diesmal eine 401 zurück.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

    const wrapper = shallowMount(LoginView)
    await wrapper.find('#username').setValue('user')
    await wrapper.find('#password').setValue('falsch')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe('Falsche Zugangsdaten')
  })

  it('leitet nach erfolgreichem Login zur Startseite weiter', async () => {
    const wrapper = shallowMount(LoginView)
    await wrapper.find('#username').setValue('celeste')
    await wrapper.find('#password').setValue('geheim')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
