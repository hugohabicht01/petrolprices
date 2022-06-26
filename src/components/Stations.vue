j<script setup lang="ts">
import type { PetrolStationsData } from '~/types'
import { useTimestamp } from '~/composables/time'

const props = defineProps<PetrolStationsData>()
if (!props.data) throw new Error("this should never be reached")

const formatted = useTimestamp(props.data?.timestamp)
</script>

<template>
  <h2>PetrolStations</h2>
  <div v-tooltip.top="formatted.absolute">Last refreshed: {{ formatted.relative }}</div>
  <div mx-1 grid md:grid-cols-2 lg:grid-cols-3>
    <Station v-for="station in props.data?.stations" :key="station.id" :station="station" />
  </div>
</template>
