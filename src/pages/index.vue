<script setup lang="ts">
import { useStationsStore } from '~/stores/stations'

const store = useStationsStore()
</script>

<template>
  <div>
    <Geolocation />
    <button dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 rounded @click="store.fetchStations">
      Find prices
    </button>
    <Stations v-if="store.prices" :data="store.prices" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
