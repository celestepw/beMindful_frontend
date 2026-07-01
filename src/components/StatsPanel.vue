<script setup lang="ts">
import { computed } from 'vue'
import { useActivities } from '@/composables/useActivities'
import { moodEmoji } from '@/moods'

const { items, streak } = useActivities()

const total = computed(() => items.value.length)

const todayCount = computed(() => {
  const today = new Date().toDateString()
  return items.value.filter((i) => {
    const d = new Date(i.date)
    return !isNaN(d.getTime()) && d.toDateString() === today
  }).length
})

const moodStats = computed<[string, number][]>(() => {
  const map = new Map<string, number>()
  for (const i of items.value) {
    const m = i.mood?.trim()
    if (m) map.set(m, (map.get(m) ?? 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
})
const maxMood = computed(() => Math.max(1, ...moodStats.value.map(([, c]) => c)))
</script>

<template>
  <section class="card stats">
    <h2>Statistik</h2>
    <div class="kpis">
      <div class="kpi">
        <span class="kpi-num">🔥 {{ streak }}</span>
        <span class="kpi-label">Streak (Tage)</span>
      </div>
      <div class="kpi">
        <span class="kpi-num">{{ total }}</span>
        <span class="kpi-label">Einträge gesamt</span>
      </div>
      <div class="kpi">
        <span class="kpi-num">{{ todayCount }}</span>
        <span class="kpi-label">Heute</span>
      </div>
    </div>

    <div v-if="moodStats.length" class="mood-chart">
      <h3>Stimmungen</h3>
      <div v-for="[label, count] in moodStats" :key="label" class="bar-row">
        <span class="bar-label">{{ moodEmoji(label) }} {{ label }}</span>
        <span class="bar-track">
          <span class="bar-fill" :style="{ width: (count / maxMood) * 100 + '%' }"></span>
        </span>
        <span class="bar-count">{{ count }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.kpis {
  display: flex;
  gap: 0.75rem;
}
.kpi {
  flex: 1;
  background: var(--surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.kpi-num {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-heading);
}
.kpi-label {
  font-size: 0.78rem;
  color: var(--text-soft);
}
.mood-chart {
  margin-top: 1rem;
}
.bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}
.bar-label {
  width: 6.5rem;
  font-size: 0.85rem;
}
.bar-track {
  flex: 1;
  height: 10px;
  background: var(--color-background-mute);
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  display: block;
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
  transition: width 0.4s;
}
.bar-count {
  width: 1.5rem;
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-soft);
}
</style>
