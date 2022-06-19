import { useGeolocation } from '@vueuse/core'
import haversine from 'haversine'
import { LatLng } from '~/types'

interface useLocationOptions {
  fallback?: LatLng
  distanceThreshold?: number
}

/**
 * Simple wrapper around useGeolocation, with fallback coords and coordinate change throttling
 */
export const useLocation = (options: useLocationOptions = {}) => {
  const {
    fallback = { lat: 52.5232, lng: 13.4127 },
    distanceThreshold = 200
  } = options

  const { coords } = useGeolocation({ enableHighAccuracy: true })

  const latlng = computed((): LatLng => ({
    lat: coords.value.latitude || fallback.lat,
    lng: coords.value.longitude || fallback.lng
  }))

  const previous = ref<LatLng>(latlng.value)

  const distanceToPrev = computed((): number => {
    console.log(`Distance to prev triggered, latlng: ${JSON.stringify(latlng.value, null, 2)}, prev: ${JSON.stringify(previous.value, null, 2)}`)
    if (!previous.value)
      return Infinity
    return haversine(latlng.value, previous.value, { format: '{lat,lng}', unit: 'meter' })
  })

  const throttledLatlng = computed(() => {
    console.log(`throttledLatlng running, latlng: ${JSON.stringify(latlng.value, null, 2)}, prev: ${JSON.stringify(previous.value, null, 2)}`)
    if (distanceToPrev.value > distanceThreshold) {
      console.log(`Updating current pos`)
      previous.value = latlng.value
      return latlng.value
    }
    return previous.value
  })

  // Expose function to reset the previous loc tracking, for example when we forced a refetch on that location and don't want to start refetching too early
  const resetDistanceTracking = () => {
    previous.value = latlng.value
  }

  return { previous, latlng, throttledLatlng, distance: distanceToPrev, resetDistanceTracking }
}

