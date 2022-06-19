import type { Ref } from 'vue'
import { ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import type { PetrolPrices, LatLng } from '~/types'

export enum fetchState {
  'idle',
  'fetching',
  'done',
  'error'
}

async function fetchStations(lat: number, lng: number) {
  if (lat === undefined || lng === undefined ||
    lat === Infinity || lng === Infinity
    || typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('bad coordinates')
  }

  const prices = await $fetch<PetrolPrices>('/api/find', {
    params: {
      lat,
      lng,
    },
    responseType: 'json',
  })
  return prices
}

export const usePetrolPrices = (latlng: Ref<LatLng>) => {
  // TODO: Refactor this to a list in order to keep a history of previously fetched values, to provide some basic level of caching
  // Maybe try to solve this in a more functional way, without this many sideeffects....
  // Currently this is one of the most impure functions I've ever written
  const prices = ref<PetrolPrices | undefined>(undefined)
  const error = ref<Error | undefined>(undefined)
  const progress = ref<fetchState>(fetchState.idle)

  const refreshCount = ref(0)

  // This is technically a data duplication, as the API returns this value, but in an unparsed format...
  const lastFetchTimestamp = ref<number>(0)

  function doFetch() {
    console.log(`doFetch was called, latlng: ${JSON.stringify(latlng.value, null, 2)}`)
    if (!latlng)
      return
    const { lat, lng } = latlng.value
    console.log(`doFetch was called with ${lat}, ${lng}`)
    if (lat === Infinity || lng === Infinity)
      return

    progress.value = fetchState.fetching
    fetchStations(lat, lng)
      .then(data => {
        prices.value = data
        progress.value = fetchState.done
        error.value = undefined
        refreshCount.value = refreshCount.value + 1
        lastFetchTimestamp.value = Date.now()
      }).catch(err => {
        error.value = err
        progress.value = fetchState.error
        prices.value = undefined
      })
  }

  watchEffect(() => {
    console.log('watchEffect triggered, calling doFetch now')
    doFetch()
  })
  return { prices, error, progress, refreshCount, doFetch, lastFetchTimestamp }
}
