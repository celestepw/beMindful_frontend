<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useActivities } from '@/composables/useActivities'
import { MOODS } from '@/moods'

interface Phase {
  name: string
  seconds: number
  scale: number
}
interface Pattern {
  id: string
  name: string
  hint: string
  phases: [Phase, ...Phase[]]
}

const { addActivity } = useActivities()

const patterns: [Pattern, ...Pattern[]] = [
  {
    id: 'calm',
    name: 'Ruhig 4-6',
    hint: 'Einatmen 4s · Ausatmen 6s',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Ausatmen', seconds: 6, scale: 0.5 },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Entspannung',
    hint: 'Einatmen 4s · Halten 7s · Ausatmen 8s',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Halten', seconds: 7, scale: 1 },
      { name: 'Ausatmen', seconds: 8, scale: 0.5 },
    ],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    hint: 'Ein 4s · Halten 4s · Aus 4s · Halten 4s',
    phases: [
      { name: 'Einatmen', seconds: 4, scale: 1 },
      { name: 'Halten', seconds: 4, scale: 1 },
      { name: 'Ausatmen', seconds: 4, scale: 0.5 },
      { name: 'Halten', seconds: 4, scale: 0.5 },
    ],
  },
]

const selectedId = ref(patterns[0].id)
const cyclesTotal = ref(3)

const running = ref(false)
const finished = ref(false)
const justLogged = ref(false)
const saveError = ref(false)
const currentCycle = ref(0)
const phaseIndex = ref(0)
const secondsLeft = ref(0)
const circleScale = ref(0.5)
const transitionSeconds = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

const selectedPattern = computed<Pattern>(
  () => patterns.find((p) => p.id === selectedId.value) ?? patterns[0],
)
const currentPhase = computed<Phase>(
  () => selectedPattern.value.phases[phaseIndex.value] ?? selectedPattern.value.phases[0],
)
const phaseLabel = computed(() => {
  if (finished.value) return 'Geschafft 🎉'
  if (running.value) return currentPhase.value.name
  return 'Bereit?'
})
const totalSeconds = computed(
  () => cyclesTotal.value * selectedPattern.value.phases.reduce((s, p) => s + p.seconds, 0),
)
const totalLabel = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  const s = totalSeconds.value % 60
  if (m > 0) return `${m} min${s > 0 ? ' ' + s + ' s' : ''}`
  return `${s} s`
})

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function enterPhase(idx: number) {
  phaseIndex.value = idx
  const phase = currentPhase.value
  secondsLeft.value = phase.seconds
  transitionSeconds.value = phase.seconds
  circleScale.value = phase.scale
}

function tick() {
  secondsLeft.value -= 1
  if (secondsLeft.value > 0) return

  const phases = selectedPattern.value.phases
  if (phaseIndex.value + 1 < phases.length) {
    enterPhase(phaseIndex.value + 1)
  } else if (currentCycle.value < cyclesTotal.value) {
    currentCycle.value += 1
    enterPhase(0)
  } else {
    finish()
  }
}

function start() {
  clearTimer()
  finished.value = false
  justLogged.value = false
  saveError.value = false
  running.value = true
  currentCycle.value = 1
  enterPhase(0)
  timer = setInterval(tick, 1000)
}

function stop() {
  clearTimer()
  running.value = false
  finished.value = false
  circleScale.value = 0.5
  transitionSeconds.value = 1
}

function finish() {
  clearTimer()
  running.value = false
  finished.value = true
  circleScale.value = 0.5
  transitionSeconds.value = 1
}

async function logMood(mood: string) {
  saveError.value = false
  try {
    await addActivity({
      title: `${selectedPattern.value.name} · ${cyclesTotal.value} Zyklen`,
      mood,
      done: true,
    })
    finished.value = false
    justLogged.value = true
  } catch (e) {
    console.error(e)
    saveError.value = true
  }
}

onUnmounted(clearTimer)
</script>

<template>
  <section class="card breathing">
    <h2>Atemübung</h2>

    <!-- Einstellungen (nur sichtbar, wenn nichts läuft) -->
    <div v-if="!running && !finished" class="setup">
      <div class="patterns">
        <button
          v-for="p in patterns"
          :key="p.id"
          class="pattern"
          :class="{ active: p.id === selectedId }"
          @click="selectedId = p.id"
        >
          <span class="pattern-name">{{ p.name }}</span>
          <span class="pattern-hint">{{ p.hint }}</span>
        </button>
      </div>

      <div class="cycles">
        <span>Zyklen:</span>
        <button class="step" @click="cyclesTotal = Math.max(1, cyclesTotal - 1)">−</button>
        <strong>{{ cyclesTotal }}</strong>
        <button class="step" @click="cyclesTotal = Math.min(10, cyclesTotal + 1)">+</button>
        <span class="muted">≈ {{ totalLabel }}</span>
      </div>
    </div>

    <!-- Atem-Animation -->
    <div class="stage">
      <div
        class="circle"
        :style="{ transform: `scale(${circleScale})`, transitionDuration: `${transitionSeconds}s` }"
      ></div>
      <div class="stage-text">
        <div class="phase">{{ phaseLabel }}</div>
        <div v-if="running" class="count">{{ secondsLeft }}</div>
        <div v-if="running" class="cycle">Zyklus {{ currentCycle }} / {{ cyclesTotal }}</div>
      </div>
    </div>

    <!-- Steuerung -->
    <div class="controls">
      <button v-if="!running && !finished" class="primary" @click="start">Starten</button>
      <button v-if="running" class="ghost" @click="stop">Stoppen</button>
    </div>

    <!-- Nach Abschluss: Stimmung festhalten -->
    <div v-if="finished" class="mood-prompt">
      <p>Wie fühlst du dich?</p>
      <div class="moods">
        <button v-for="m in MOODS" :key="m.label" class="mood" @click="logMood(m.label)">
          <span class="mood-emoji">{{ m.emoji }}</span>
          <span>{{ m.label }}</span>
        </button>
      </div>
      <button class="link" @click="stop">Ohne Eintrag schließen</button>
      <p v-if="saveError" class="error">Konnte nicht gespeichert werden – läuft das Backend?</p>
    </div>

    <p v-if="justLogged" class="logged">Eingetragen ✓ Gut gemacht!</p>
  </section>
</template>

<style scoped>
.stage {
  position: relative;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0 1rem;
}
.circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--primary-soft), var(--primary));
  box-shadow: 0 10px 40px rgba(47, 158, 143, 0.25);
  transition-property: transform;
  transition-timing-function: ease-in-out;
}
.stage-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.phase {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-heading);
}
.count {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--primary-strong);
  line-height: 1.1;
}
.cycle {
  font-size: 0.85rem;
  color: var(--text-soft);
}

.patterns {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.pattern {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  border: 1px solid var(--color-border);
  background: var(--surface);
}
.pattern.active {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.pattern-name {
  font-weight: 600;
}
.pattern-hint {
  font-size: 0.8rem;
  color: var(--text-soft);
}
.cycles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cycles .step {
  width: 2rem;
  padding: 0.3rem 0;
  text-align: center;
}
.controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.mood-prompt {
  margin-top: 1rem;
  text-align: center;
}
.mood-prompt .moods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 0.5rem 0;
}
.mood {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  min-width: 4.5rem;
}
.mood-emoji {
  font-size: 1.4rem;
}
.logged {
  text-align: center;
  color: var(--primary-strong);
  margin-top: 0.75rem;
  font-weight: 600;
}
</style>
