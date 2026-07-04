<script setup lang="ts"></script>

<template>
  <span class="brand-logo">
    <svg class="mark" viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
      <circle class="ring ring-outer" cx="20" cy="20" r="16" />
      <circle class="ring ring-mid" cx="20" cy="20" r="10" />
      <circle class="dot" cx="20" cy="20" r="4" />
    </svg>
    <span class="wordmark"><span class="be">be</span><span class="mindful">Mindful</span></span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.mark {
  display: block;
  overflow: visible;
}
.ring {
  fill: none;
  stroke-width: 3;
  transform-box: fill-box;
  transform-origin: center;
}
.ring-outer {
  stroke: var(--primary-soft);
  animation: breathe 4s ease-in-out infinite;
}
.ring-mid {
  stroke: var(--primary);
  animation: breathe 4s ease-in-out infinite;
  animation-delay: 0.3s;
}
.dot {
  fill: var(--primary-strong);
}
.wordmark {
  font-size: 1.35rem;
  letter-spacing: -0.01em;
}
.be {
  color: var(--text-soft);
  font-weight: 500;
}
.mindful {
  color: var(--primary-strong);
  font-weight: 800;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ring {
    animation: none !important;
  }
}
</style>
