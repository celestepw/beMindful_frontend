<script setup lang="ts">
// Belaubte Bäumchen am unteren Rand, die sanft im Wind schwanken.
const trees = [
  { left: '2%', scale: 0.8, dur: 5, delay: 0 },
  { left: '12%', scale: 1.15, dur: 6, delay: -1 },
  { left: '23%', scale: 0.65, dur: 4.5, delay: -2 },
  { left: '33%', scale: 0.95, dur: 5.8, delay: -0.7 },
  { left: '45%', scale: 1.25, dur: 6.5, delay: -0.5 },
  { left: '56%', scale: 0.75, dur: 5, delay: -1.8 },
  { left: '66%', scale: 1.05, dur: 6.2, delay: -1.2 },
  { left: '77%', scale: 0.7, dur: 4.8, delay: -2.4 },
  { left: '87%', scale: 1.1, dur: 5.6, delay: -0.3 },
  { left: '95%', scale: 0.6, dur: 4.6, delay: -1.6 },
]
</script>

<template>
  <div class="trees" aria-hidden="true">
    <div class="ground-band"></div>
    <div
      v-for="(t, i) in trees"
      :key="i"
      class="tree"
      :style="{ left: t.left, animationDuration: t.dur + 's', animationDelay: t.delay + 's' }"
    >
      <svg viewBox="0 0 90 110" width="100" height="122" :style="{ transform: `scale(${t.scale})` }">
        <g transform="translate(45,104)">
          <!-- Stamm mit Ästen -->
          <path class="trunk" d="M-5 0 C-6 -14 -5 -26 -3 -36 L3 -36 C5 -26 6 -14 5 0 Z" />
          <path class="branch" d="M0 -28 Q-9 -33 -15 -42" />
          <path class="branch" d="M0 -24 Q9 -29 15 -37" />
          <!-- Blätterkrone -->
          <g class="leaves-dark">
            <circle cx="0" cy="-52" r="22" />
            <circle cx="-16" cy="-44" r="15" />
            <circle cx="16" cy="-44" r="15" />
            <circle cx="-9" cy="-64" r="13" />
            <circle cx="9" cy="-64" r="13" />
          </g>
          <g class="leaves-light">
            <circle cx="-6" cy="-56" r="12" />
            <circle cx="7" cy="-50" r="10" />
          </g>
          <g class="leaf-accents">
            <ellipse cx="-24" cy="-40" rx="4.5" ry="2.4" transform="rotate(-28 -24 -40)" />
            <ellipse cx="24" cy="-40" rx="4.5" ry="2.4" transform="rotate(28 24 -40)" />
            <ellipse cx="0" cy="-74" rx="4" ry="2.4" />
          </g>
          <!-- süßes Gesicht -->
          <g class="face" transform="translate(0,-50)">
            <circle class="cheek" cx="-9" cy="3" r="3" />
            <circle class="cheek" cx="9" cy="3" r="3" />
            <circle class="eye" cx="-5" cy="0" r="2" />
            <circle class="eye" cx="5" cy="0" r="2" />
            <path class="smile" d="M-5 4 q5 4 10 0" />
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.trees {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160px;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.ground-band {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 34px;
  background: linear-gradient(#cfe6d8, #bbdfcd);
}
.tree {
  position: absolute;
  bottom: 18px;
  transform-origin: bottom center;
  animation-name: sway-tree;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.tree svg {
  display: block;
  transform-origin: bottom center;
  filter: drop-shadow(0 6px 10px rgba(47, 158, 143, 0.12));
}
.trunk {
  fill: #8a5a3c;
}
.branch {
  stroke: #8a5a3c;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
}
.leaves-dark circle,
.leaves-light circle {
  fill: #2b8a7a;
}
.leaf-accents ellipse {
  fill: #2b8a7a;
}
.eye {
  fill: #2b3a37;
}
.smile {
  fill: none;
  stroke: #2b3a37;
  stroke-width: 2.2;
  stroke-linecap: round;
}
.cheek {
  fill: #ffb7b0;
  opacity: 0.6;
}

@keyframes sway-tree {
  from {
    transform: rotate(-3deg);
  }
  to {
    transform: rotate(3deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tree {
    animation: none;
  }
}
</style>
