<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Passwort</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Einloggen</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '../auth'
import { useRouter } from 'vue-router'

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

<style scoped>
.login {
  max-width: 320px;
  margin: 2rem auto;
}
.error {
  color: red;
}
</style>
