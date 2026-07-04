<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Exercise } from '@/types'
import { useActivities } from '@/composables/useActivities'
import { MOODS, moodEmoji } from '@/moods'

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
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ---- Stimmungs-Filter ----
const moodFilter = ref('')

// ---- Tagesansicht ----
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
const exerciseItems = computed<Exercise[]>(() =>
  dayItems.value.filter((i) => i.title !== JOURNAL_TITLE),
)

// ---- Journal-Notiz bearbeiten ----
const noteText = ref('')
const saving = ref(false)
const saveError = ref(false)
const savedHint = ref(false)

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

async function deleteNote() {
  if (!journalEntry.value) return
  if (!confirm('Journaleintrag wirklich löschen?')) return
  try {
    await deleteActivity(journalEntry.value.id)
    noteText.value = ''
  } catch (e) {
    console.error(e)
  }
}

// Fehlgeklickte Stimmung entfernen (Übung bleibt erhalten)
async function deleteMood(item: Exercise) {
  try {
    await updateActivity(item.id, {
      title: item.title,
      mood: '',
      done: item.done,
      note: item.note,
    })
  } catch (e) {
    console.error(e)
  }
}

// ---- Gefilterte Ansicht nach Stimmung ----
const filteredByMood = computed<Exercise[]>(() => {
  const m = moodFilter.value.trim().toLowerCase()
  if (!m) return []
  return items.value
    .filter((i) => i.title !== JOURNAL_TITLE && (i.mood ?? '').toLowerCase() === m)
    .sort((a, b) => (new Date(b.date).getTime() || b.id) - (new Date(a.date).getTime() || a.id))
})

function noteForDay(iso: string): string {
  const day = startOfDay(new Date(iso))
  const entry = items.value.find((i) => i.title === JOURNAL_TITLE && isSameDay(i.date, day))
  return entry?.note ?? ''
}
</script>

<template>
  <section class="card">
    <div class="journal-head">
      <h2>Journal</h2>
      <label class="filter">
        Stimmung
        <select v-model="moodFilter">
          <option value="">alle</option>
          <option v-for="m in MOODS" :key="m.label" :value="m.label">{{ m.emoji }} {{ m.label }}</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="muted">Lädt…</p>
    <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>

    <!-- Tagesansicht -->
    <template v-else-if="moodFilter === ''">
      <div class="daynav">
        <button class="nav" title="Vorheriger Tag" @click="prevDay">‹</button>
        <span class="day">{{ dayLabel }}</span>
        <button class="nav" title="Nächster Tag" :disabled="isToday" @click="nextDay">›</button>
      </div>

      <!-- Journal-Notiz -->
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
          <button v-if="journalEntry" class="mini danger" @click="deleteNote">Notiz löschen</button>
          <span v-if="savedHint" class="saved">Gespeichert ✓</span>
          <span v-if="saveError" class="error">Konnte nicht gespeichert werden.</span>
        </div>
      </div>

      <!-- Übungen & Stimmungen als separate Kästchen -->
      <div class="day-entries">
        <h3>An diesem Tag</h3>
        <p v-if="exerciseItems.length === 0" class="muted">Keine Übungen an diesem Tag.</p>
        <div v-else class="boxes">
          <template v-for="item in exerciseItems" :key="item.id">
            <div class="box">
              <span class="box-label">Übung</span>
              <span class="box-value">🌳 {{ item.title }}</span>
            </div>
            <div v-if="item.mood" class="box">
              <span class="box-label">Stimmung</span>
              <span class="box-value">{{ moodEmoji(item.mood) }} {{ item.mood }}</span>
              <button class="mini danger" title="Stimmung entfernen" @click="deleteMood(item)">🗑️</button>
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- Gefilterte Ansicht nach Stimmung -->
    <template v-else>
      <p v-if="filteredByMood.length === 0" class="muted">Keine Einträge mit dieser Stimmung.</p>
      <ul v-else class="filter-list">
        <li v-for="item in filteredByMood" :key="item.id" class="filter-row">
          <div class="filter-top">
            <span class="filter-mood">{{ moodEmoji(item.mood) }} {{ item.mood }}</span>
            <span class="filter-date muted">{{ formatDate(item.date) }}</span>
            <button class="mini danger" title="Stimmung entfernen" @click="deleteMood(item)">🗑️</button>
          </div>
          <p v-if="noteForDay(item.date)" class="filter-note">📔 {{ noteForDay(item.date) }}</p>
          <p v-else class="filter-note muted">Kein Journaleintrag an diesem Tag.</p>
        </li>
      </ul>
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
.filter {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-soft);
}

.daynav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}
.day {
  font-size: 0.85rem;
  color: var(--text-soft);
  min-width: 9rem;
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

.day-entries {
  margin-top: 1.25rem;
}
.boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.box {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--surface-soft);
  position: relative;
}
.box-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-soft);
}
.box-value {
  font-weight: 600;
}
.box .mini {
  align-self: flex-end;
  margin-top: 0.15rem;
}
.mini {
  padding: 0.25rem 0.45rem;
  font-size: 0.85rem;
}
.mini.danger:hover {
  background: #f6dcd7;
}

.filter-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filter-row {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--surface-soft);
  padding: 0.6rem 0.75rem;
}
.filter-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-mood {
  font-weight: 600;
}
.filter-date {
  margin-left: auto;
  font-size: 0.8rem;
}
.filter-note {
  margin-top: 0.35rem;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
