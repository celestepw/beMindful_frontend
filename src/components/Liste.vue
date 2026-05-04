<script setup lang="ts">

defineProps<{
  title: string
}>()

type BspExercises = {
  id: number
  name: string
  duration: number
}

const items : BspExercises[] = [
  { id: 1, name: 'Einatmen', duration: 10 },
  { id: 2, name: 'Halten', duration: 20 },
  { id: 3, name: 'Ausatmen', duration: 30 }
]

</script>

<template>
    <table>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{item.name}}</td>
        <td>{{item.duration}}</td>
      </tr>
      </tbody>
    </table>
</template>

<style scoped>

</style>
