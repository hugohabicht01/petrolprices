<script setup lang="ts">
import { fetchState, usePetrolPrices } from '~/composables/petrolPrices'

const { coords } = useGeolocation({ enableHighAccuracy: true })
const lat = ref<number>(Infinity)
const lng = ref<number>(Infinity)
watchThrottled(coords, (val) => {
  lat.value = val.latitude
  lng.value = val.longitude
})
const { prices, progress, error } = usePetrolPrices(lat, lng)

</script>

<template>
  <div>
    <!-- <Geolocation /> -->
    <!-- <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="store.fetchStations">
      Find prices
    </button> -->
    <div>
      lat: {{ lat }}, lng: {{ lng }}
    </div>
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
