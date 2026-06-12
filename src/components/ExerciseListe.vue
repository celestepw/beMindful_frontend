<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import type { Exercise } from "@/types.ts"

const props = defineProps<{ title?: string }>()

const items: Ref<Exercise[]> = ref([])
const streak = ref(0)
const newTitle = ref('')
const newMood = ref('')

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

async function loadThings() {
  const response = await fetch(baseUrl + '/activities', { method: 'GET' })
  items.value = await response.json()
}

async function loadStreak() {
  const response = await fetch(baseUrl + '/streak', { method: 'GET' })
  streak.value = await response.json()
}

async function addActivity() {
  const response = await fetch(baseUrl + '/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTitle.value || props.title || 'Atemübung',
      mood: newMood.value,
      done: true
    })
  })
  const saved = await response.json()
  items.value.push(saved)
  newTitle.value = ''
  newMood.value = ''
  await loadStreak()
}

onMounted(() => {
  loadThings()
  loadStreak()
})
</script>

<template>
  <section>
    <p>🔥 Streak: {{ streak }} Tage</p>

    <div>
      <input v-model="newTitle" :placeholder="props.title || 'Übung'" />
      <input v-model="newMood" placeholder="Stimmung" />
      <button @click="addActivity">Erledigt ✓</button>
    </div>

    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.title }}
        <span v-if="item.mood"> – {{ item.mood }}</span>
        <span v-if="item.done"> ✓</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
</style>
