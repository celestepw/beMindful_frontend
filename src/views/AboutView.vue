<script setup lang="ts"></script>

<template>
  <main class="about">
    <section class="card">
      <h1>Über beMindful</h1>
      <p>
        beMindful hilft dir, mit kurzen, geführten Atemübungen zur Ruhe zu kommen und deine
        Achtsamkeits-Routine aufzubauen.
      </p>

      <h2>Atemmuster</h2>
      <ul class="patterns">
        <li>
          <strong>Ruhig 4-6</strong> – Einatmen 4 s, Ausatmen 6 s. Ideal für einen schnellen Moment
          der Entspannung.
        </li>
        <li>
          <strong>4-7-8 Entspannung</strong> – Einatmen 4 s, Halten 7 s, Ausatmen 8 s. Hilft beim
          Runterkommen und Einschlafen.
        </li>
        <li>
          <strong>Box Breathing</strong> – je 4 s einatmen, halten, ausatmen, halten. Für Fokus und
          Stressabbau.
        </li>
      </ul>

      <h2>So funktioniert's</h2>
      <ol>
        <li>Muster und Anzahl der Zyklen wählen.</li>
        <li>Auf „Starten“ tippen und dem atmenden Kreis folgen.</li>
        <li>Nach der Übung deine Stimmung festhalten – so wächst dein Streak. 🔥</li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.about {
  width: 100%;
}
.about h1 {
  margin-bottom: 0.75rem;
}
.about h2 {
  margin-top: 1.25rem;
}
.about p {
  margin-bottom: 0.5rem;
}
.patterns,
ol {
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.patterns li,
ol li {
  line-height: 1.5;
}
</style>
