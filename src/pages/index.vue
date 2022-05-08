<script setup lang="ts">
import { fetchState, usePetrolPrices } from '~/composables/petrolPrices'

const { coords } = useGeolocation({ enableHighAccuracy: true })
const lat = ref<number>(Infinity)
const lng = ref<number>(Infinity)
watchThrottled(coords, (val) => {
  lat.value = val.latitude
  lng.value = val.longitude
}, { throttle: 1000 })
const { prices, progress, error, refreshCount, distanceToPrevious, previous } = usePetrolPrices(lat, lng, { refreshDistanceThreshold: 5 })

</script>

<template>
  <div>
    <!-- <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="store.fetchStations">
      Find prices
    </button> -->
    <div>
      lat: {{ lat }}, lng: {{ lng }}
    </div>
    <div>
      <h2>Composable infos</h2>
      <p>Previous: {{ previous }}</p>
      <p>distanceToPrevious: {{ distanceToPrevious }}</p>
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
