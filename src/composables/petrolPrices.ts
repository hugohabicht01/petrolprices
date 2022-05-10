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

export const usePetrolPrices = (latlng: Ref<{ lat: number; lng: number }>, { refreshDistanceThreshold }: { refreshDistanceThreshold: number }) => {
  const prices = ref<PetrolPrices | undefined>(undefined)
  const error = ref<Error | undefined>(undefined)
  const progress = ref<fetchState>(fetchState.idle)
  const refreshCount = ref(0)
  const previous = ref<ICoord[]>([])

  const distanceToPrevious = computed(() => {
    if (previous.value.length === 0)
      return Infinity
    const { lat: prevLat, lng: prevLng } = previous.value[previous.value.length - 1]
    if (prevLat === Infinity || prevLng === Infinity)
      return Infinity

    return haversine({ lat: latlng.value.lat, lng: latlng.value.lng }, { lat: prevLat, lng: prevLng }, { unit: 'meter', format: '{lat,lng}' })
  })

  function doFetch() {
    const { lat, lng } = latlng.value
    if (lat === Infinity || lng === Infinity)
      return
    progress.value = fetchState.fetching
    fetchStations(lat, lng)
      .then(data => {
        prices.value = data
        progress.value = fetchState.done
        error.value = undefined
        refreshCount.value = refreshCount.value + 1
        previous.value.push({ lat, lng })
      }).catch(err => {
        error.value = err
        progress.value = fetchState.error
        prices.value = undefined
      })
  }

  watchEffect(() => {
    if (distanceToPrevious.value > refreshDistanceThreshold)
      doFetch()
  })
  return { prices, error, progress, refreshCount, doFetch, previous, distanceToPrevious }
}
