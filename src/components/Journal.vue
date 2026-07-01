<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Exercise } from '@/types'
import { useActivities } from '@/composables/useActivities'
import { moodEmoji } from '@/moods'

// Einträge mit diesem Titel sind die eigentlichen Tagebuch-Notizen.
const JOURNAL_TITLE = 'Tagebuch'

const { items, loading, errorMsg, addActivity, updateActivity, deleteActivity } = useActivities()

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function isSameDay(iso: string, day: Date): boolean {
  const d = new Date(iso)
  return !isNaN(d.getTime()) && startOfDay(d).getTime() === day.getTime()
}

const selectedDay = ref(startOfDay(new Date()))
const isToday = computed(() => selectedDay.value.getTime() === startOfDay(new Date()).getTime())

const dayLabel = computed(() => {
  const today = startOfDay(new Date())
  const diff = Math.round((today.getTime() - selectedDay.value.getTime()) / 86_400_000)
  const formatted = selectedDay.value.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  if (diff === 0) return `Heute · ${formatted}`
  if (diff === 1) return `Gestern · ${formatted}`
  return formatted
})

function prevDay() {
  const d = new Date(selectedDay.value)
  d.setDate(d.getDate() - 1)
  selectedDay.value = startOfDay(d)
}
function nextDay() {
  if (isToday.value) return
  const d = new Date(selectedDay.value)
  d.setDate(d.getDate() + 1)
  selectedDay.value = startOfDay(d)
}

const dayItems = computed<Exercise[]>(() => items.value.filter((i) => isSameDay(i.date, selectedDay.value)))
const journalEntry = computed<Exercise | undefined>(() =>
  dayItems.value.find((i) => i.title === JOURNAL_TITLE),
)
const otherItems = computed<Exercise[]>(() =>
  dayItems.value.filter((i) => i.title !== JOURNAL_TITLE),
)

const noteText = ref('')
const saving = ref(false)
const saveError = ref(false)
const savedHint = ref(false)

// Textfeld beim Tageswechsel / Nachladen mit der gespeicherten Notiz füllen.
watch(
  [journalEntry, selectedDay],
  () => {
    noteText.value = journalEntry.value?.note ?? ''
    savedHint.value = false
  },
  { immediate: true },
)

// Für vergangene Tage ohne Eintrag kann nichts neu angelegt werden
// (das Backend datiert neue Einträge auf heute).
const canEdit = computed(() => isToday.value || !!journalEntry.value)

async function saveNote() {
  if (saving.value || !canEdit.value) return
  saving.value = true
  saveError.value = false
  savedHint.value = false
  try {
    if (journalEntry.value) {
      await updateActivity(journalEntry.value.id, {
        title: JOURNAL_TITLE,
        mood: journalEntry.value.mood ?? '',
        done: true,
        note: noteText.value,
      })
    } else {
      await addActivity({ title: JOURNAL_TITLE, mood: '', done: true, note: noteText.value })
    }
    savedHint.value = true
  } catch (e) {
    console.error(e)
    saveError.value = true
  } finally {
    saving.value = false
  }
}

async function removeEntry(item: Exercise) {
  if (!confirm(`„${item.title}“ wirklich löschen?`)) return
  try {
    await deleteActivity(item.id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="card journal">
    <div class="journal-head">
      <h2>Journal</h2>
      <div class="daynav">
        <button class="nav" title="Vorheriger Tag" @click="prevDay">‹</button>
        <span class="day">{{ dayLabel }}</span>
        <button class="nav" title="Nächster Tag" :disabled="isToday" @click="nextDay">›</button>
      </div>
    </div>

    <p v-if="loading" class="muted">Lädt…</p>
    <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>

    <template v-else>
      <!-- Tagebuch-Notiz -->
      <div class="note-block">
        <textarea
          v-model="noteText"
          class="note"
          :placeholder="
            canEdit
              ? 'Wie war dein Tag? Was ist dir durch den Kopf gegangen?'
              : 'Für diesen vergangenen Tag gibt es keine Notiz.'
          "
          :disabled="!canEdit"
          rows="4"
        ></textarea>
        <div class="note-actions">
          <button class="primary" :disabled="!canEdit || saving" @click="saveNote">
            {{ saving ? 'Speichern…' : 'Notiz speichern' }}
          </button>
          <span v-if="savedHint" class="saved">Gespeichert ✓</span>
          <span v-if="saveError" class="error">Konnte nicht gespeichert werden.</span>
          <span v-if="!canEdit" class="muted hint">Notizen lassen sich nur für heute neu anlegen.</span>
        </div>
      </div>

      <!-- Aktivitäten dieses Tages -->
      <div class="day-entries">
        <h3>An diesem Tag</h3>
        <p v-if="otherItems.length === 0" class="muted">Keine Übungen an diesem Tag.</p>
        <ul v-else class="list">
          <li v-for="item in otherItems" :key="item.id" class="row">
            <div class="row-main">
              <span class="row-title">{{ item.title }}</span>
              <span v-if="item.mood" class="row-mood">{{ moodEmoji(item.mood) }} {{ item.mood }}</span>
            </div>
            <button class="mini danger" title="Löschen" @click="removeEntry(item)">🗑️</button>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>

<style scoped>
.journal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.daynav {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.day {
  font-size: 0.85rem;
  color: var(--text-soft);
  min-width: 8rem;
  text-align: center;
}
.nav {
  width: 2rem;
  padding: 0.2rem 0;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1;
}
.nav:disabled {
  opacity: 0.4;
  cursor: default;
}

.note-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.note {
  font: inherit;
  color: var(--color-text);
  background: var(--surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}
.note:focus {
  border-color: var(--primary);
}
.note:disabled {
  background: var(--surface-soft);
  color: var(--text-soft);
}
.note-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.saved {
  color: var(--primary-strong);
  font-weight: 600;
}
.hint {
  font-size: 0.8rem;
}

.day-entries {
  margin-top: 1.25rem;
}
.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.4rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--surface-soft);
}
.row-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.row-title {
  font-weight: 600;
}
.row-mood {
  font-size: 0.85rem;
  color: var(--text-soft);
}
.mini {
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
}
.mini.danger:hover {
  background: #f6dcd7;
}
</style>
