<script setup lang="ts">
import { fetchState, usePetrolPrices } from '~/composables/petrolPrices'

const { coords } = useGeolocation({ enableHighAccuracy: true })
const latlng = computed(() => ({ lat: coords.value.latitude, lng: coords.value.longitude }))
const { prices, progress, error, refreshCount, distanceToPrevious, previous, doFetch } = usePetrolPrices(latlng, { refreshDistanceThreshold: 25 })

const onSelected = (id: string) => {
  console.log(`Selected: ${id}`)
}
</script>

<template>
  <div>
    <GMap :data="prices" @selected="onSelected" />
    <!-- <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="store.fetchStations">
      Find prices
    </button> -->
    <div>
      lat: {{ latlng.lat }}, lng: {{ latlng.lng }}
    </div>
    <div>
      <h2>Composable infos</h2>
      <p>Previous: {{ previous }}</p>
      <p>distanceToPrevious: {{ distanceToPrevious }}</p>
    </div>
    <div>
      <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="doFetch">
        Find prices
      </button>
    </div>
    <p>Refresh count: {{ refreshCount }}</p>
    <p v-if="error">
      Couldn't find real time fuel prices
    </p>
    <p v-if="progress === fetchState.fetching">
      loading...
    </p>
    <Stations v-if="prices" :data="prices" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
