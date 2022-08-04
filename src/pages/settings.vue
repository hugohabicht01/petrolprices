<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStationsStore } from '~/stores/stations'
import { useLocationStore } from '~/stores/location'

const stations = useStationsStore()
const { reset: resetLocation } = useLocationStore()

// const { doFetch, forceRefreshPrices } = stations

const { radius } = storeToRefs(stations)
</script>

<template>
  <div grid grid-cols-2 grid-flow-row justify-items-start auto-rows-auto p-2 w-max grid-gap-4>
    <h1 font-bold text-8 col-span-2>
      Settings
    </h1>
    <div mt-2 contents>
      <label for="resetGPSbtn">Reset GPS tracking</label>
      <input
        id="resetGPSbtn" type="button" dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded
        value="Reset" @click="resetLocation"
      >
      <label for="radiusrange">Change search radius</label>
      <input id="radiusrange" v-model="radius" type="range" min="1" max="20" step="0.5">
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
