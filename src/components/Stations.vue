<script setup lang="ts">
import type { PetrolStationsData } from '~/types'

const props = defineProps<PetrolStationsData>()
</script>

<template>
  <h2>PetrolStations</h2>
  <div>Timestamp: {{ props.data.timestamp }}</div>
  <div mx-1 grid md:grid-cols-2 lg:grid-cols-3>
    <Station v-for="station in props.data.stations" :key="station.id" :station="station" />
  </div>
</template>
