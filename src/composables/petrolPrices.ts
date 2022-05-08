import type { Ref } from 'vue'
import { ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import haversine from 'haversine'
import type { PetrolPrices } from '~/types'

export enum fetchState {
  'idle',
  'fetching',
  'done',
  'error'
}

interface ICoord {
  lat: number
  lng: number
}

async function fetchStations(lat: number, lng: number) {
  if (lat === Infinity || lng === Infinity)
    throw new Error('bad coordinates')

  const prices = await $fetch<PetrolPrices>('/api/find', {
    params: {
      lat,
      lng,
    },
    responseType: 'json',
  })
  return prices
}

export const usePetrolPrices = (lat: Ref<number>, lng: Ref<number>, { refreshDistanceThreshold }: { refreshDistanceThreshold: number }) => {
  const prices = ref<PetrolPrices | null>(null)
  const error = ref<Error | null>(null)
  const progress = ref<fetchState>(fetchState.idle)
  const refreshCount = ref(0)

  const previous = ref<ICoord[]>([{ lat: lat.value, lng: lng.value }])

  const distanceToPrevious = computed(() => {
    const { lat: prevLat, lng: prevLng } = previous.value[previous.value.length - 1]
    return haversine({ lat: lat.value, lng: lng.value }, { lat: prevLat, lng: prevLng }, { unit: 'meter' })
  })

  function doFetch() {
    prices.value = null
    progress.value = fetchState.fetching
    previous.value.push({ lat: lat.value, lng: lng.value })
    fetchStations(lat.value, lng.value)
      .then(data => {
        prices.value = data
        progress.value = fetchState.done
        error.value = null
        refreshCount.value = refreshCount.value + 1
      }).catch(err => {
        error.value = err
        progress.value = fetchState.error
        prices.value = null
      })
  }
  // watchEffect(doFetch)
  setTimeout(doFetch, 0)
  watch(() => ({ lat, lng }), () => {
    // If the coordinates aren't at least 50 meters apart, then we won't refetch
    if (distanceToPrevious.value > refreshDistanceThreshold)
      doFetch()
  })
  return { prices, error, progress, refreshCount, doFetch, previous, distanceToPrevious }
}
