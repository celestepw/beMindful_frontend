<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Exercise } from '@/types'
import { useActivities } from '@/composables/useActivities'
import { MOODS, moodEmoji } from '@/moods'

const { items, loading, errorMsg, updateActivity, deleteActivity } = useActivities()

const search = ref('')
const sort = ref<'newest' | 'oldest'>('newest')

const editingId = ref<number | null>(null)
const editTitle = ref('')
const editMood = ref('')

const filtered = computed<Exercise[]>(() => {
  const q = search.value.trim().toLowerCase()
  const list = items.value.filter(
    (i) => !q || i.title.toLowerCase().includes(q) || (i.mood ?? '').toLowerCase().includes(q),
  )
  return [...list].sort((a, b) => {
    const da = new Date(a.date).getTime() || a.id
    const db = new Date(b.date).getTime() || b.id
    return sort.value === 'newest' ? db - da : da - db
  })
})

function formatDate(d: string): string {
  const date = new Date(d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

function startEdit(item: Exercise) {
  editingId.value = item.id
  editTitle.value = item.title
  editMood.value = item.mood ?? ''
}
function cancelEdit() {
  editingId.value = null
}
async function saveEdit(item: Exercise) {
  try {
    await updateActivity(item.id, {
      title: editTitle.value.trim() || item.title,
      mood: editMood.value,
      done: item.done,
    })
    editingId.value = null
  } catch (e) {
    console.error(e)
  }
}
async function remove(item: Exercise) {
  if (!confirm(`„${item.title}“ wirklich löschen?`)) return
  try {
    await deleteActivity(item.id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <section class="card">
    <div class="list-head">
      <h2>Verlauf</h2>
      <div class="tools">
        <input v-model="search" class="search" placeholder="Suchen…" />
        <select v-model="sort" class="sort">
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
      </div>
    </div>

    <p v-if="loading" class="muted">Lädt…</p>
    <p v-else-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="filtered.length === 0" class="muted">Noch keine Einträge.</p>

    <ul v-else class="list">
      <li v-for="item in filtered" :key="item.id" class="row">
        <template v-if="editingId === item.id">
          <input v-model="editTitle" class="edit-input" />
          <select v-model="editMood" class="edit-mood">
            <option value="">– Stimmung –</option>
            <option v-for="m in MOODS" :key="m.label" :value="m.label">
              {{ m.emoji }} {{ m.label }}
            </option>
          </select>
          <div class="row-actions">
            <button class="mini primary" @click="saveEdit(item)">Speichern</button>
            <button class="mini" @click="cancelEdit">Abbrechen</button>
          </div>
        </template>

        <template v-else>
          <div class="row-main">
            <span class="row-title">{{ item.title }}</span>
            <span v-if="item.mood" class="row-mood">{{ moodEmoji(item.mood) }} {{ item.mood }}</span>
          </div>
          <span class="row-date muted">{{ formatDate(item.date) }}</span>
          <div class="row-actions">
            <button class="mini" title="Bearbeiten" @click="startEdit(item)">✏️</button>
            <button class="mini danger" title="Löschen" @click="remove(item)">🗑️</button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tools {
  display: flex;
  gap: 0.5rem;
}
.search {
  width: 8rem;
}
.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
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
.row-date {
  font-size: 0.8rem;
  white-space: nowrap;
}
.row-actions {
  display: flex;
  gap: 0.3rem;
}
.mini {
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
}
.mini.danger:hover {
  background: #f6dcd7;
}
.edit-input {
  flex: 1;
  min-width: 0;
}
.edit-mood {
  width: auto;
}
</style>
