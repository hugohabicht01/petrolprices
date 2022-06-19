import { Ref } from 'vue'
import haversine from 'haversine'
import { LatLng } from '~/types'

interface useLocationOptions {
  fallback?: LatLng
  distanceThreshold?: number
  enableHighAccuracy?: boolean
  maximumAge?: number
  timeout?: number
}

/**
 * Simple wrapper around navigator.geolocation, with fallback coords and coordinate change throttling
 */
export const useLocation = (options: useLocationOptions = {}) => {
  const {
    fallback = { lat: 52.5232, lng: 13.4127 },
    distanceThreshold = 200,
    enableHighAccuracy = true,
    maximumAge = 30000,
    timeout = 27000,
  } = options

  const isSupported = navigator && 'geolocation' in navigator

  const locatedAt: Ref<number | null> = ref(null)
  const error = ref<GeolocationPositionError | null>(null)
  const throttledLatlng: Ref<LatLng> = ref(fallback)
  const coords: Ref<GeolocationPosition['coords']> = ref({
    accuracy: 0,
    latitude: fallback.lat,
    longitude: fallback.lng,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  })


  function updatePosition(position: GeolocationPosition) {
    console.log('updatePosition called', position.coords)
    locatedAt.value = position.timestamp
    coords.value = position.coords
    error.value = null

    const { latitude: lat, longitude: lng } = position.coords
    const distanceToPrev = haversine(throttledLatlng.value, { lat, lng }, { format: '{lat,lng}', unit: 'meter' })

    if (distanceToPrev > distanceThreshold) {
      throttledLatlng.value = { lat, lng }
    }
  }

  let watcher: number

  if (isSupported) {
    watcher = navigator!.geolocation.watchPosition(
      updatePosition,
      err => error.value = err,
      {
        enableHighAccuracy,
        maximumAge,
        timeout,
      },
    )
  }

  const resetDistanceTracking = () => {
    throttledLatlng.value = { lat: coords.value.latitude, lng: coords.value.longitude }
  }

  tryOnScopeDispose(() => {
    if (watcher && navigator)
      navigator.geolocation.clearWatch(watcher)
  })

  return { coords, throttledLatlng, resetDistanceTracking, error, locatedAt }
}

