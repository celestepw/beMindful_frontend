<script setup lang="ts">
import { onMounted } from 'vue'
import DailyQuote from '@/components/DailyQuote.vue'
import BreathingExercise from '@/components/BreathingExercise.vue'
import Journal from '@/components/Journal.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import { useActivities } from '@/composables/useActivities'

const { loadActivities, loadStreak } = useActivities()

onMounted(() => {
  loadActivities()
  loadStreak()
})
</script>

<template>
  <main class="home">
    <DailyQuote />

    <div class="layout">
      <div class="col">
        <BreathingExercise />
      </div>
      <div class="col">
        <StatsPanel />
        <Journal />
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  width: 100%;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
