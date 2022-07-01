import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { useLocationStore } from './location'
import { usePetrolPrices } from '~/composables/petrolPrices'

const REFETCH_INTERVAL = 5 * 60 * 1000
const REFETCH_THRESHOLD = 2 * 60 * 1000

export const useStationsStore = defineStore('stations', () => {
  /*
   *
   * TODO: Needs concept
   * Given that I want to fetch stations when panning on the map,
   * while also fetching stations while the car is moving,
   * I need somehow decide what coords to use, either the coords of the GPS or the coords
   * of the gmaps viewport. Another option would be to fetch both, but that would often mean doing loads of calls twice 
   * Given that I'm not using any sort of caching and that the tankerkoenig API is shared + ratelimited,
   * that probably would'nt be a good idea
   *
   */
  const locationData = useLocationStore()

  const { error: locationError, coords, locatedAt, throttledLatlng } = storeToRefs(locationData)
  const { resetDistanceTracking } = locationData
  const { prices, progress, error: priceError, doFetch, lastFetchTimestamp } = usePetrolPrices(throttledLatlng)


  const { pause, resume, isActive: refetchingIsActive } = useIntervalFn(() => {
    const timeSinceLastFetch = Date.now() - lastFetchTimestamp.value
    if (timeSinceLastFetch > REFETCH_THRESHOLD) {
      doFetch()
    }
  }, REFETCH_INTERVAL)

  const stopOnError = () => priceError ? pause() : resume()

  watch(priceError, stopOnError)
  watch(locationError, stopOnError)


  const forceRefreshPrices = () => {
    resume()
    doFetch()
    resetDistanceTracking()
  }

  return {
    locationError,
    coords,
    locatedAt,
    throttledLatlng,
    prices,
    progress,
    priceError,
    doFetch,
    refetchingIsActive,
    forceRefreshPrices
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStationsStore, import.meta.hot))
