<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Quote {
  q: string
  a: string
}

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

const quote = ref<Quote | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    // /quote ist öffentlich – kein Auth-Header nötig.
    const res = await fetch(baseUrl + '/quote', { method: 'GET' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data: Quote[] = await res.json()
    quote.value = data[0] ?? null
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="quote-card">
    <p v-if="loading" class="quote-loading">Tagesmotto wird geladen…</p>
    <template v-else-if="quote">
      <p class="quote-text">„{{ quote.q }}"</p>
      <p class="quote-author">— {{ quote.a }}</p>
    </template>
  </section>
</template>

<style scoped>
.quote-card {
  background: var(--surface-soft);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--primary);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}
.quote-loading {
  color: var(--text-soft);
  font-style: italic;
}
.quote-text {
  font-style: italic;
  color: var(--color-heading);
  font-size: 1.05rem;
  line-height: 1.5;
}
.quote-author {
  text-align: right;
  color: var(--text-soft);
  font-size: 0.9rem;
  margin-top: 0.4rem;
}
</style>
