<script setup lang="ts">
import { ref } from 'vue'
import { login } from '../auth'
import { useRouter } from 'vue-router'
import TreesBackground from '@/components/TreesBackground.vue'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin(): Promise<void> {
  error.value = ''
  try {
    await login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<template>
  <main class="auth">
    <TreesBackground />

    <div class="card auth-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" required />
        </div>
        <div class="field">
          <label for="password">Passwort</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <button class="primary" type="submit">Einloggen</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}
.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 360px;
}
.auth-card h2 {
  text-align: center;
  margin-bottom: 1.25rem;
}
form {
  display: flex;
  flex-direction: column;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.9rem;
}
.field label {
  font-size: 0.85rem;
  color: var(--text-soft);
}
.field input {
  width: 100%;
}
form button {
  width: 100%;
  margin-top: 0.3rem;
}
.error {
  color: var(--danger);
  margin-top: 0.75rem;
  text-align: center;
}
</style>
