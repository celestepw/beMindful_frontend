<template>
  <div class="register">
    <h2>Registrieren</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="email">E-Mail</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="password">Passwort</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Registrieren</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Erfolgreich registriert! Du kannst dich jetzt einloggen.</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { register } from '../auth'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)

async function handleRegister(): Promise<void> {
  error.value = ''
  success.value = false
  try {
    await register(username.value, email.value, password.value)
    success.value = true
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<style scoped>
.register {
  max-width: 320px;
  margin: 2rem auto;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
