<script setup lang="ts"></script>

<template>
  <main class="impressum">
    <section class="card">
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        Lena Kieu Trinh Dittmann<br />
        Celeste Parlow
      </p>

      <h2>Anschrift</h2>
      <p>
        Treskowallee 8<br />
        10318 Berlin – Bezirk Lichtenberg
      </p>

      <h2>Kontakt</h2>
      <p>
        <a href="mailto:lena.dittmann@student.htw-berlin.de">lena.dittmann@student.htw-berlin.de</a
        ><br />
        <a href="mailto:celeste.parlow@student.htw-berlin.de">celeste.parlow@student.htw-berlin.de</a>
      </p>

      <p class="note muted">
        beMindful ist ein studentisches Projekt an der HTW Berlin (Wirtschaftsinformatik).
      </p>
    </section>
  </main>
</template>

<style scoped>
.impressum {
  max-width: 520px;
  margin: 0 auto;
}
.impressum h1 {
  margin-bottom: 1rem;
}
.impressum h2 {
  margin-top: 1.25rem;
  font-size: 1rem;
}
.impressum p {
  margin-top: 0.35rem;
  line-height: 1.6;
}
.note {
  margin-top: 1.5rem;
  font-size: 0.85rem;
}
</style>
