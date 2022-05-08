import type { Ref } from 'vue'
import { ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import type { PetrolPrices } from '~/types'

export enum fetchState {
  'idle',
  'fetching',
  'done',
  'error'
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

export const usePetrolPrices = (lat: Ref<number>, lng: Ref<number>) => {
  const prices = ref<PetrolPrices | null>(null)
  const error = ref<Error | null>(null)
  const progress = ref<fetchState>(fetchState.idle)

  function doFetch() {
    prices.value = null
    progress.value = fetchState.fetching
    fetchStations(lat.value, lng.value)
      .then(data => {
        prices.value = data
        progress.value = fetchState.done
        error.value = null
      }).catch(err => {
        error.value = err
        progress.value = fetchState.error
        prices.value = null
      })
  }
  watchEffect(doFetch)
  return { prices, error, progress }
}
