<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStationsStore } from '~/stores/stations'
import { fetchState } from '~/composables';

const stations = useStationsStore()
const { doFetch, forceRefreshPrices } = stations

const { priceError, locationError, throttledLatlng, prices, progress, locatedAt, refetchingIsActive } = storeToRefs(stations)


</script>

<template>
  <div>
    <!-- <GMap :data="prices" @change-selected="onSelected" @change-bounds="onRadiusChanged" /> -->
    <div>
      <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="forceRefreshPrices">
        Find prices
      </button>
    </div>
    <div>
      <p>coords: {{ throttledLatlng.lat }}, {{ throttledLatlng.lng }}</p>
      <p>locatedAt: {{ locatedAt }}</p>
      <p>refetchingIsActive: {{ refetchingIsActive }}</p>
      <p text-red v-if="locationError">Couldn't get coords due to: {{ locationError.message }}, try reloading the page
        and allow the
        page access to your geolocation</p>
    </div>
    <p v-if="priceError">Couldn't find real time fuel prices</p>
    <p v-if="progress === fetchState.fetching">loading...</p>
    <Stations v-if="prices" :data="prices" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
