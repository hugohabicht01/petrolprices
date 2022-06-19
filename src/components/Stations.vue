<script setup lang="ts">
import type { PetrolStationsData } from '~/types'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

const reactiveDayjs = reactify(dayjs)

const props = defineProps<PetrolStationsData>()

const parseFormat = "YYYY-MM-DDTHH:mm-ss"
const parsedTimestamp = reactiveDayjs(props.data?.timestamp, parseFormat)
const formattedTimestamp = computed(() => parsedTimestamp.value.format('HH:mm:ss'))
</script>

<template>
  <h2>PetrolStations</h2>
  <div>Raw: {{ props.data?.timestamp }}</div>
  <div>Timestamp: {{ formattedTimestamp }}</div>
  <div mx-1 grid md:grid-cols-2 lg:grid-cols-3>
    <Station v-for="station in props.data?.stations" :key="station.id" :station="station" />
  </div>
</template>
