<script setup lang="ts">
import type { PetrolStationsData } from '~/types'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

const props = defineProps<PetrolStationsData>()

const refreshToken = useInterval(10_000)

const parsedTimestamp = computed(() => dayjs(props?.data?.timestamp, "YYYY-MM-DDTHH:mm-ss"))

const formattedTimestamp = computed(() => {
  // Hack to force this computed to rerun
  refreshToken.value = refreshToken.value + 1;
  return { relative: parsedTimestamp.value.fromNow(), absolute: parsedTimestamp.value.format('HH:mm:ss') }
})

</script>

<template>
  <h2>PetrolStations</h2>
  <div>Raw: {{ props.data?.timestamp }}</div>
  <!--TODO: Make this a proper looking tooltip, possibly with floating ui -->
  <div v-tooltip.top="formattedTimestamp.absolute">Last refreshed: {{ formattedTimestamp.relative }}</div>
  <div mx-1 grid md:grid-cols-2 lg:grid-cols-3>
    <Station v-for="station in props.data?.stations" :key="station.id" :station="station" />
  </div>
</template>
