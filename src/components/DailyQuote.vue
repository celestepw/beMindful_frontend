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
  <section v-if="loading || quote" class="quote">
    <p v-if="loading" class="quote-loading">Tagesmotto wird geladen…</p>
    <template v-else-if="quote">
      <span class="quote-mark quote-mark-open" aria-hidden="true">“</span>
      <p class="quote-text">{{ quote.q }}</p>
      <p class="quote-author">— {{ quote.a }}</p>
      <span class="quote-mark quote-mark-close" aria-hidden="true">“</span>
    </template>
  </section>
</template>

<style scoped>
.quote {
  position: relative;
  max-width: 640px;
  margin: 0 auto 1.75rem;
  padding: 1.9rem 2.25rem 1.6rem;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-soft), var(--surface));
  border: 1px solid var(--color-border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.quote-mark {
  position: absolute;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 5rem;
  line-height: 1;
  color: var(--primary);
  opacity: 0.18;
}
.quote-mark-open {
  top: -0.4rem;
  left: 1.1rem;
}
.quote-mark-close {
  bottom: -0.4rem;
  right: 1.1rem;
  transform: rotate(180deg);
}
.quote-text {
  position: relative;
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.55;
  color: var(--color-heading);
}
.quote-author {
  margin-top: 0.75rem;
  color: var(--primary-strong);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
}
.quote-loading {
  color: var(--text-soft);
  font-style: italic;
}
</style>
