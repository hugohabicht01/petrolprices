import type { Ref } from 'vue'
import { ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import type { LatLng, MaybeRef, PetrolPrices } from '~/types'

export enum fetchState {
  'idle',
  'fetching',
  'done',
  'error'
}

async function fetchStations(lat: number, lng: number, rad = 2) {
  if (typeof lat !== 'number' || typeof lng !== 'number' || lat === Infinity || lng === Infinity)
    throw new Error('bad coordinates')

  const prices = await $fetch<PetrolPrices>('/api/find', {
    params: {
      lat,
      lng,
      rad
    },
    responseType: 'json',
  })
  return prices
}

export const usePetrolPrices = (latlng: Ref<LatLng>, rad: MaybeRef<number> = 2) => {
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
    if (!latlng.value)
      return
    const { lat, lng } = latlng.value
    console.log(`doFetch was called with ${lat}, ${lng}`)
    // // TODO: remove these triple checks, these are everywhere...
    // if (lat === Infinity || lng === Infinity)
    //   return
    console.log('rad: ', unref(rad))
    progress.value = fetchState.fetching
    fetchStations(lat, lng, unref(rad))
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

  if (isRef(rad))
    watch(rad, () => doFetch)

  return { prices, error, progress, refreshCount, doFetch, lastFetchTimestamp }
}
