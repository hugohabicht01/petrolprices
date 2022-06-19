<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLocationStore } from '~/stores/location'
import { usePetrolPrices, fetchState } from '~/composables/petrolPrices'

const locationData = useLocationStore()
const { error: locationError, coords, locatedAt, throttledLatlng } = storeToRefs(locationData)
const { resetDistanceTracking } = locationData
const { prices, progress, error, doFetch } = usePetrolPrices(throttledLatlng)

// TODO: Put the logic of this component into a pinia store, to preserve state between switching pages, reloads, etc


const forceRefreshPrices = () => {
  doFetch()
  resetDistanceTracking()
}

// const onSelected = (id: string) => {
//   console.log(`Selected: ${id}`)
// }

// const onRadiusChanged = (latlng: google.maps.LatLng, radius: number) => {
// }
// console.log(`Search should now be at ${latlng.lat()}, ${latlng.lng()} with radius ${radius}`)
</script>

<template>
  <div>
    <!-- <GMap :data="prices" @change-selected="onSelected" @change-bounds="onRadiusChanged" /> -->
    <div>
      <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="forceRefreshPrices">Find
        prices</button>
    </div>
    <div>
      <p>throttledLatlng: {{ throttledLatlng }}</p>
      <p>coords: {{ coords.latitude }}, {{ coords.longitude }}</p>
      <p>locatedAt: {{ locatedAt }}</p>
      <p text-red v-if="locationError">Couldn't get coords due to: {{ locationError.message }}, try reloading the page
        and allow the
        page access to your geolocation</p>
    </div>
    <p v-if="error">Couldn't find real time fuel prices</p>
    <p v-if="progress === fetchState.fetching">loading...</p>
    <Stations v-if="prices" :data="prices" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
