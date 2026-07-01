<script setup lang="ts">
import { ref } from 'vue'
import { useActivities } from '@/composables/useActivities'
import { MOODS } from '@/moods'

const { addActivity } = useActivities()
const title = ref('')
const mood = ref('')
const saving = ref(false)
const saveError = ref(false)

async function submit() {
  if (saving.value) return
  saving.value = true
  saveError.value = false
  try {
    await addActivity({ title: title.value.trim() || 'Atemübung', mood: mood.value })
    title.value = ''
    mood.value = ''
  } catch (e) {
    console.error(e)
    saveError.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="card">
    <h2>Eintrag hinzufügen</h2>
    <div class="form">
      <input v-model="title" placeholder="Übung (z. B. Atemübung)" @keyup.enter="submit" />
      <div class="moods">
        <button
          v-for="m in MOODS"
          :key="m.label"
          class="mood"
          :class="{ active: mood === m.label }"
          @click="mood = mood === m.label ? '' : m.label"
        >
          {{ m.emoji }} {{ m.label }}
        </button>
      </div>
      <button class="primary" :disabled="saving" @click="submit">
        {{ saving ? 'Speichern…' : 'Erledigt ✓' }}
      </button>
      <p v-if="saveError" class="error">Konnte nicht gespeichert werden – läuft das Backend?</p>
    </div>
  </section>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.moods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.mood.active {
  background: var(--primary-soft);
  border-color: var(--primary);
}
</style>
