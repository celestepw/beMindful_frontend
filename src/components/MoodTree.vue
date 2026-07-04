<script setup lang="ts">
// health: 0 = welk & schlafend, 1 = frisch & froh (dazwischen wird interpoliert)
// raining: Regenwolke sichtbar (nach der Übung wird der Baum gegossen)
withDefaults(defineProps<{ health: number; raining?: boolean }>(), { raining: false })
</script>

<template>
  <div class="tree" :class="{ fresh: health >= 1 && !raining, wilted: health <= 0 && !raining }">
    <svg viewBox="0 0 140 170" width="190" height="230" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="ground" cx="70" cy="152" rx="48" ry="7" />

      <g class="tree-body">
        <path class="trunk" d="M64 150 C62 132 63 120 66 110 L74 110 C77 120 78 132 76 150 Z" />
        <path class="branch" d="M70 122 Q58 116 50 106" />
        <path class="branch" d="M70 118 Q82 112 90 102" />

        <!-- Krone: welke (olivfarbene) Basis + frische (grüne) Schicht, per health überblendet -->
        <g class="canopy-group" :style="{ transform: `translateY(${(1 - health) * 6}px)` }">
          <g class="canopy wilt">
            <circle cx="54" cy="62" r="20" />
            <circle cx="86" cy="62" r="20" />
            <circle cx="46" cy="90" r="22" />
            <circle cx="94" cy="90" r="22" />
            <circle cx="70" cy="100" r="20" />
            <circle cx="70" cy="80" r="34" />
          </g>
          <g class="canopy fresh-leaves" :style="{ opacity: health }">
            <circle cx="54" cy="62" r="20" />
            <circle cx="86" cy="62" r="20" />
            <circle cx="46" cy="90" r="22" />
            <circle cx="94" cy="90" r="22" />
            <circle cx="70" cy="100" r="20" />
            <circle cx="70" cy="80" r="34" />
          </g>

          <!-- Gesicht: schlafend -->
          <g class="face sleeping" transform="translate(70,86)" :style="{ opacity: 1 - health }">
            <path class="eye-closed" d="M-12 -2 q4 4 8 0" />
            <path class="eye-closed" d="M4 -2 q4 4 8 0" />
            <path class="mouth-calm" d="M-5 7 q5 3 10 0" />
            <text class="zzz z1" x="15" y="-4">z</text>
            <text class="zzz z2" x="20" y="-10">z</text>
          </g>
          <!-- Gesicht: froh -->
          <g class="face" transform="translate(70,86)" :style="{ opacity: health }">
            <path class="eye-happy" d="M-13 -2 q4 -5 8 0" />
            <path class="eye-happy" d="M5 -2 q4 -5 8 0" />
            <circle class="cheek" cx="-14" cy="4" r="3.5" />
            <circle class="cheek" cx="14" cy="4" r="3.5" />
            <path class="smile" d="M-8 5 q8 7 16 0" />
          </g>
        </g>
      </g>

      <!-- Regenwolke: gießt den Baum nach der Übung -->
      <g v-if="raining" class="rain">
        <g class="rain-cloud">
          <ellipse cx="70" cy="30" rx="30" ry="12" />
          <circle cx="52" cy="26" r="12" />
          <circle cx="70" cy="18" r="16" />
          <circle cx="88" cy="26" r="12" />
        </g>
        <g class="drops">
          <line class="drop d1" x1="52" y1="40" x2="52" y2="47" />
          <line class="drop d2" x1="62" y1="40" x2="62" y2="47" />
          <line class="drop d3" x1="72" y1="40" x2="72" y2="47" />
          <line class="drop d4" x1="82" y1="40" x2="82" y2="47" />
          <line class="drop d5" x1="90" y1="40" x2="90" y2="47" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.tree {
  display: flex;
  justify-content: center;
}
svg {
  display: block;
  overflow: visible;
}
.ground {
  fill: #d8e6df;
}
.trunk {
  fill: #8a5a3c;
}
.branch {
  stroke: #8a5a3c;
  stroke-width: 4;
  fill: none;
  stroke-linecap: round;
}
.canopy-group {
  transition: transform 0.6s ease;
}
.canopy.wilt circle {
  fill: #9aa87f;
}
.canopy.fresh-leaves circle {
  fill: var(--primary);
}
.canopy.fresh-leaves,
.face {
  transition: opacity 0.5s ease;
}

/* Gesicht */
.eye-happy,
.smile,
.eye-closed,
.mouth-calm {
  fill: none;
  stroke: #2b3a37;
  stroke-linecap: round;
}
.eye-happy {
  stroke-width: 2.4;
}
.smile {
  stroke-width: 2.6;
}
.eye-closed {
  stroke-width: 2.2;
}
.mouth-calm {
  stroke-width: 2.2;
}
.zzz {
  fill: var(--text-soft);
  font-size: 8px;
  font-weight: 700;
}
.zzz.z2 {
  font-size: 6px;
}
.sleeping .zzz {
  animation: zfloat 2.6s ease-in-out infinite;
}
.sleeping .zzz.z2 {
  animation-delay: 0.7s;
}
.cheek {
  fill: #ffb7b0;
  opacity: 0.6;
}

/* Regen */
.rain-cloud ellipse,
.rain-cloud circle {
  fill: #9fb6c7;
}
.drop {
  stroke: #6fa8dc;
  stroke-width: 2.4;
  stroke-linecap: round;
  animation: fall 0.9s linear infinite;
}
.drop.d2 {
  animation-delay: 0.2s;
}
.drop.d3 {
  animation-delay: 0.45s;
}
.drop.d4 {
  animation-delay: 0.15s;
}
.drop.d5 {
  animation-delay: 0.35s;
}

/* Stimmungs-Bewegung */
.tree.fresh {
  animation: sway 4.5s ease-in-out infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  25% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(95px);
    opacity: 0;
  }
}
@keyframes sway {
  0%,
  100% {
    transform: rotate(-1.5deg);
  }
  50% {
    transform: rotate(1.5deg);
  }
}
@keyframes zfloat {
  0% {
    transform: translate(0, 0);
    opacity: 0.2;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    transform: translate(4px, -8px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tree,
  .drop {
    animation: none !important;
  }
}
</style>
