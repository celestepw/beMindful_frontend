<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchProfile, changePassword, type Profile } from '@/composables/useProfile'
import { preferences } from '@/preferences'
import { breathingPatterns } from '@/breathingPatterns'

const profile = ref<Profile | null>(null)
const loadError = ref('')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const pwSaving = ref(false)
const pwMessage = ref('')
const pwError = ref('')

onMounted(async () => {
  try {
    profile.value = await fetchProfile()
  } catch (e) {
    loadError.value = (e as Error).message
  }
})

async function submitPassword() {
  pwMessage.value = ''
  pwError.value = ''
  if (newPassword.value.length < 6) {
    pwError.value = 'Neues Passwort muss mindestens 6 Zeichen haben.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    pwError.value = 'Die neuen Passwörter stimmen nicht überein.'
    return
  }
  pwSaving.value = true
  try {
    await changePassword(currentPassword.value, newPassword.value)
    pwMessage.value = 'Passwort geändert ✓'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    pwError.value = (e as Error).message
  } finally {
    pwSaving.value = false
  }
}
</script>

<template>
  <main class="profile">
    <h1>Profil</h1>

    <!-- Konto-Infos -->
    <section class="card">
      <h2>Konto</h2>
      <p v-if="loadError" class="error">{{ loadError }}</p>
      <template v-else-if="profile">
        <div class="info-row">
          <span class="label">Username</span>
          <span>{{ profile.username }}</span>
        </div>
        <div class="info-row">
          <span class="label">E-Mail</span>
          <span>{{ profile.email }}</span>
        </div>
      </template>
      <p v-else class="muted">Lädt…</p>
    </section>

    <!-- Passwort ändern -->
    <section class="card">
      <h2>Passwort ändern</h2>
      <form class="form" @submit.prevent="submitPassword">
        <input v-model="currentPassword" type="password" placeholder="Aktuelles Passwort" required />
        <input
          v-model="newPassword"
          type="password"
          placeholder="Neues Passwort (min. 6 Zeichen)"
          required
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Neues Passwort bestätigen"
          required
        />
        <button class="primary" type="submit" :disabled="pwSaving">
          {{ pwSaving ? 'Speichern…' : 'Passwort ändern' }}
        </button>
        <p v-if="pwMessage" class="saved">{{ pwMessage }}</p>
        <p v-if="pwError" class="error">{{ pwError }}</p>
      </form>
    </section>

    <!-- App-Einstellungen (lokal gespeichert) -->
    <section class="card">
      <h2>App-Einstellungen</h2>
      <p class="muted">Diese Voreinstellungen werden bei der Atemübung übernommen.</p>
      <div class="form">
        <label class="field">
          <span>Standard-Atemmuster</span>
          <select v-model="preferences.defaultPattern">
            <option v-for="p in breathingPatterns" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label class="field">
          <span>Standard-Zyklen</span>
          <div class="cycles">
            <button
              type="button"
              class="step"
              @click="preferences.defaultCycles = Math.max(1, preferences.defaultCycles - 1)"
            >
              −
            </button>
            <strong>{{ preferences.defaultCycles }}</strong>
            <button
              type="button"
              class="step"
              @click="preferences.defaultCycles = Math.min(10, preferences.defaultCycles + 1)"
            >
              +
            </button>
          </div>
        </label>
        <label class="field">
          <span>Dark Mode</span>
          <span class="switch">
            <input type="checkbox" v-model="preferences.darkMode" />
            <span class="slider"></span>
          </span>
        </label>
        <p class="muted hint">Automatisch gespeichert.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.profile h1 {
  text-align: center;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--color-border);
}
.info-row:last-child {
  border-bottom: none;
}
.label {
  color: var(--text-soft);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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
.saved {
  color: var(--primary-strong);
  font-weight: 600;
}
.hint {
  font-size: 0.8rem;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex: none;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.switch input:checked + .slider {
  background: var(--primary);
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
