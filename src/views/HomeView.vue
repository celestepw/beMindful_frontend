<script setup lang="ts">
import { onMounted } from 'vue'
import BreathingExercise from '@/components/BreathingExercise.vue'
import ActivityForm from '@/components/ActivityForm.vue'
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
    <section class="hero">
      <h1>beMindful</h1>
      <p>Tägliche Atemübungen für mehr Ruhe und Achtsamkeit.</p>
    </section>

    <div class="layout">
      <div class="col">
        <BreathingExercise />
        <ActivityForm />
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
.hero {
  text-align: center;
  margin-bottom: 1.5rem;
}
.hero h1 {
  font-size: 2.2rem;
}
.hero p {
  color: var(--text-soft);
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
