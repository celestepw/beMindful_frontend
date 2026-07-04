<script setup lang="ts">
// Ein paar Wolken in verschiedenen Höhen/Größen/Geschwindigkeiten.
const clouds = [
  { top: '8%', scale: 1.0, duration: 70, delay: 0, opacity: 0.9 },
  { top: '18%', scale: 0.5, duration: 120, delay: -90, opacity: 0.55 },
  { top: '28%', scale: 0.65, duration: 95, delay: -35, opacity: 0.7 },
  { top: '42%', scale: 0.85, duration: 78, delay: -60, opacity: 0.7 },
  { top: '52%', scale: 1.25, duration: 80, delay: -55, opacity: 0.85 },
  { top: '68%', scale: 0.55, duration: 110, delay: -20, opacity: 0.6 },
  { top: '82%', scale: 0.9, duration: 88, delay: -70, opacity: 0.75 },
]
</script>

<template>
  <div class="clouds" aria-hidden="true">
    <div
      v-for="(c, i) in clouds"
      :key="i"
      class="cloud"
      :style="{
        top: c.top,
        opacity: c.opacity,
        animationDuration: c.duration + 's',
        animationDelay: c.delay + 's',
      }"
    >
      <svg viewBox="0 0 120 70" width="180" height="105" :style="{ transform: `scale(${c.scale})` }">
        <g fill="#ffffff">
          <ellipse cx="60" cy="48" rx="48" ry="18" />
          <circle cx="38" cy="42" r="18" />
          <circle cx="60" cy="32" r="24" />
          <circle cx="84" cy="42" r="18" />
        </g>
        <g class="cloud-face">
          <circle class="cheek" cx="46" cy="50" r="3.5" />
          <circle class="cheek" cx="74" cy="50" r="3.5" />
          <circle cx="52" cy="44" r="2.4" />
          <circle cx="68" cy="44" r="2.4" />
          <path d="M54 50 q6 5 12 0" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.clouds {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.cloud {
  position: absolute;
  left: 0;
  animation-name: drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.cloud svg {
  display: block;
  filter: drop-shadow(0 8px 14px rgba(47, 158, 143, 0.08));
}
.cloud-face circle {
  fill: #5b6b67;
}
.cloud-face path {
  fill: none;
  stroke: #5b6b67;
  stroke-width: 2.2;
  stroke-linecap: round;
}
.cloud-face .cheek {
  fill: #ffb7b0;
  opacity: 0.55;
}

@keyframes drift {
  from {
    transform: translateX(-25vw);
  }
  to {
    transform: translateX(125vw);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cloud {
    animation: none;
  }
}
</style>
