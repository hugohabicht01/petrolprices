import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { useLocationStore } from './location'
import { usePetrolPrices } from '~/composables/petrolPrices'

const REFETCH_INTERVAL = 5 * 60 * 1000
const REFETCH_THRESHOLD = 2 * 60 * 1000

export const useStationsStore = defineStore('stations', () => {

  const locationData = useLocationStore()
  const { error: locationError, coords, locatedAt, throttledLatlng } = storeToRefs(locationData)
  // const { resetDistanceTracking } = locationData
  const { prices, progress, error, doFetch, lastFetchTimestamp } = usePetrolPrices(throttledLatlng)


  const { pause, resume, isActive } = useIntervalFn(() => {
    const timeSinceLastFetch = Date.now() - lastFetchTimestamp.value
    if (timeSinceLastFetch > REFETCH_THRESHOLD) {
      doFetch()
    }
  }, REFETCH_INTERVAL)

  watch(error, () => {
    if (error) {
      pause()
    } else {
      resume()
    }
  })

  watch(locationError, () => {
    if (locationError) {
      pause()
    } else {
      resume()
    }
  })
  // TODO: Put the logic of this component into a pinia store, to preserve state between switching pages, reloads, etc


  // const forceRefreshPrices = () => {
  //   doFetch()
  //   resetDistanceTracking()
  // }

  return {
    locationError,
    coords,
    locatedAt,
    throttledLatlng,
    prices,
    progress,
    error,
    doFetch
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStationsStore, import.meta.hot))
