<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { authState, logout } from './auth'
import BrandLogo from './components/BrandLogo.vue'
import CloudsBackground from './components/CloudsBackground.vue'

const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <CloudsBackground />

    <header class="topbar">
      <RouterLink to="/" class="brand"><BrandLogo /></RouterLink>
      <nav>
        <template v-if="authState.isAuthenticated">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">Über</RouterLink>
          <RouterLink to="/profile">Profil</RouterLink>
          <button class="logout-btn" @click="handleLogout">Abmelden</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Registrieren</RouterLink>
        </template>
      </nav>
    </header>

    <RouterView />

    <footer class="app-footer">
      <RouterLink to="/impressum">Impressum</RouterLink>
      <span>· beMindful · HTW Berlin</span>
    </footer>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}
.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}
nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
nav a {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  color: var(--color-text);
  transition: background 0.2s;
}
nav a:hover {
  background: var(--surface-soft);
}
nav a.router-link-exact-active {
  background: var(--primary-soft);
  color: var(--primary-strong);
}
.logout-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: none;
  background: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: inherit;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: var(--surface-soft);
}
.app-footer {
  margin-top: 2.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--color-border);
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-soft);
}
.app-footer a {
  color: var(--text-soft);
  text-decoration: underline;
}
.app-footer a:hover {
  color: var(--primary-strong);
}
.app-footer span {
  margin-left: 0.4rem;
}
</style>
