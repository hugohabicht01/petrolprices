<script setup lang="ts">
import type { byCoordinates } from 'tankerkoenigv4'
import { $fetch } from 'ohmyfetch'

type PetrolStations = Awaited<ReturnType<typeof byCoordinates>>

const station = reactive<{ stations: PetrolStations | null }>({ stations: null })
const { coords, isSupported, error, locatedAt } = useGeolocation({ enableHighAccuracy: true })

const fetchStations = async () => {
  const res = await $fetch('/api/find', {
    params: {
      lat: coords.value.latitude,
      lng: coords.value.longitude,
    },
  })
  console.log({ res })
  station.stations = res
}

</script>

<template>
  <div>
    <h1>Current coordinates:</h1>
    <div v-if="!isSupported" text-red-400>
      Not supported
    </div>
    <p v-if="isSupported && !error">
      {{ coords.latitude }},
      {{ coords.longitude }}
    </p>
    <div v-if="error">
      Error: {{ error }}
    </div>
    <div>Located at: {{ locatedAt }}</div>
    <button dark:bg-bluegray-200 dark:text-black bg-sky-300 text-blue-800 px-4 py-2 rounded @click="fetchStations">
      Fetch
    </button>
    <div>
      <h2>Petrolstations:</h2>
      <pre>
        {{ station.stations }}
      </pre>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
