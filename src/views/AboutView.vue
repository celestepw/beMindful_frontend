<script setup lang="ts"></script>

<template>
  <main class="about">
    <section class="card">
      <h1>Über beMindful</h1>
      <p>
        beMindful ist dein kleiner Begleiter für mehr Ruhe im Alltag. Zwischen Uni, Arbeit und
        vielen Aufgaben bleibt Achtsamkeit oft auf der Strecke. Mit kurzen, geführten Atemübungen
        holst du dir jederzeit einen Moment zum Durchatmen zurück.
      </p>
      <p>
        Die Idee dahinter ist einfach: Schon wenige bewusste Atemzüge am Tag können helfen, Stress
        abzubauen, klarer zu denken und besser zu schlafen. beMindful macht daraus eine leichte
        tägliche Gewohnheit.
      </p>

      <h2>Dein Bäumchen</h2>
      <p>
        Dein Fortschritt bekommt ein Gesicht in Form eines kleinen Bäumchens. Solange du heute noch
        nicht geübt hast, schläft es. Sobald du deine Atemübung machst, wird es gegossen, wacht auf
        und strahlt wieder. So siehst du auf einen Blick, ob du dir heute schon deinen Moment
        genommen hast.
      </p>

      <h2>Journal</h2>
      <p>
        Nach jeder Übung hältst du deine Stimmung fest, und im Journal kannst du für jeden Tag ein
        paar Gedanken notieren. Später blätterst du durch vergangene Tage oder filterst nach
        Stimmung, um nachzulesen, wie es dir ging.
      </p>

      <h2>Dein Streak</h2>
      <p>
        Der Streak zeigt, wie viele Tage am Stück du bei beMindful aktiv warst. Jeder Tag, an dem
        du eine Atemübung abschließt oder einen Journaleintrag speicherst, zählt mit. Machst du an
        einem Tag beides, zählt der Tag trotzdem ganz normal.
      </p>
      <p>
        Legst du einen Tag Pause ein, beginnt der Streak wieder von vorn. Es geht also nicht um
        Perfektion, sondern darum, kleine Momente der Ruhe zu einer regelmäßigen Gewohnheit werden
        zu lassen.
      </p>

      <h2>Atemmuster</h2>
      <ul class="patterns">
        <li>
          <strong>Sanfte Ruhe</strong>: Einatmen 4 Sekunden, Ausatmen 6 Sekunden. Ideal für einen
          schnellen Moment der Entspannung.
        </li>
        <li>
          <strong>Tiefe Entspannung</strong>: Einatmen 4, Halten 7, Ausatmen 8 Sekunden. Hilft beim
          Runterkommen und Einschlafen.
        </li>
        <li>
          <strong>Klarer Fokus</strong>: jeweils 4 Sekunden einatmen, halten, ausatmen und halten.
          Gut für Konzentration und Stressabbau.
        </li>
      </ul>

      <h2>So funktioniert es</h2>
      <ol>
        <li>Wähle ein Atemmuster und die Anzahl der Zyklen.</li>
        <li>Tippe auf „Starten“ und folge dem Atemball, der größer und kleiner wird.</li>
        <li>
          Halte danach deine Stimmung fest und sieh zu, wie dein Bäumchen aufwacht und dein Streak
          um einen Tag wächst.
        </li>
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
