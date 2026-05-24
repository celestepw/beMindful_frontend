<style scoped>
</style>

<script setup lang="ts">

import { onMounted, type Ref, ref } from 'vue'
import type { Exercise } from "@/types.ts";

const items: Ref<Exercise[]> = ref([])

async function loadThings() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/activities'
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow'
  }
  fetch(endpoint, requestOptions)
    .then(response => response.json())
    .then(result => result.forEach((activities: Exercise) => {
      items.value.push(activities)
    }))
    .catch(error => console.log('error', error))
}

onMounted(() => {
  loadThings()
})
</script>
