<script setup lang="ts">

defineProps<{
  title: string
}>()

type Exercise = {
  id: number
  name: string
  duration: number
}

const items : Exercise[] = [
  { id: 1, name: 'Einatmen', duration: 4 },
  { id: 2, name: 'Halten', duration: 5 },
  { id: 3, name: 'Ausatmen', duration: 7 }
]


</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <table>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.duration }} Sekunden</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>
