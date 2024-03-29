<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import type { PetrolStationsData } from '~/types'

// TODO: Get latlng from useLocation
const { data } = defineProps<PetrolStationsData>()
const emit = defineEmits<{ (e: 'changeSelected', id: string): void; (e: 'changeBounds', latlng: google.maps.LatLng, radius: number): void }>()
let GOOGLE_MAPS_APIKEY = 'AIzaSyA7hIehrKYoBwLICdOM6er-4R06sUHSa_w'
if (import.meta.env.DEV === true) {
  // In development, we use an unrestricted API key, the main key is restricted to v2.cyborgs.tech
  GOOGLE_MAPS_APIKEY = import.meta.env.VITE_GOOGLE_MAPS_APIKEY as unknown as string
  console.log('Using Google Maps API key from environment:', GOOGLE_MAPS_APIKEY)
}

const loader = new Loader({
  apiKey: GOOGLE_MAPS_APIKEY,
  libraries: ['geometry', 'drawing']
})
const mapDiv = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)

onMounted(async () => {
  const { coords } = useGeolocation({ enableHighAccuracy: true })
  await loader.load()
  if (mapDiv.value) {
    map.value = new google.maps.Map(mapDiv.value, {
      center: latlng.value,
      zoom: 8,
      clickableIcons: false,
    })

    map.value.addListener('bounds_changed', () => {
      if (!map.value)
        return
      const bounds = map.value.getBounds()
      const centerPoint = map.value.getCenter()
      const northEastPoint = bounds?.getNorthEast()

      if (!bounds || !northEastPoint || !centerPoint)
        return

      const searchRadius = Math.round(google.maps.geometry.spherical.computeDistanceBetween(centerPoint, northEastPoint) / 100) / 10
      emit('changeBounds', centerPoint, searchRadius)
    })

    const currentPosMarker = new google.maps.Marker({
      position: latlng.value,
      map: map.value,
    })

    watchEffect(() => {
      if (map.value) {
        currentPosMarker.setPosition(latlng.value)
        map.value.setCenter(latlng.value)
      }
    })

    const stationMarkers = ref<google.maps.Marker[]>([])

    // Path taken from mdi gas station icon
    const PetrolStationIcon: google.maps.Symbol = {
      strokeColor: 'black',
      fillColor: 'black',
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWeight: 0.01,
      scale: 2,
      anchor: new google.maps.Point(9, 21),
      path: 'M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1a1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6c-1.11 0-2 .89-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 18 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77Z',
    }

    watch(() => data?.stations, () => {
      console.log(`Watch triggered, stations: ${toRaw(data?.stations)}`)
      stationMarkers.value.forEach((marker) => marker.setMap(null))
      stationMarkers.value.length = 0

      if (data?.stations !== undefined && data?.stations?.length > 0)
        map.value?.setZoom(13)

      else
        map.value?.setZoom(8)

      data?.stations.forEach((station) => {
        const marker = new google.maps.Marker({
          position: { lat: station.coords.lat, lng: station.coords.lng },
          map: map.value,
          icon: PetrolStationIcon,
        })
        marker.addListener('click', () => emit('changeSelected', station.id))
        stationMarkers.value.push(marker)
      })
    },
    { immediate: true })

    // const directionsService = new google.maps.DirectionsService()
    // directionsService.route({ destination: 'Maintaler Straße 20 63452 Hanau', origin: 'Bachstrasse 10 63452 Hanau', travelMode: google.maps.TravelMode.DRIVING }, (response, status) => {
    //   if (status === 'OK')
    //     console.log(JSON.parse(JSON.stringify(response)))
    // })
  }
})
</script>

<template>
  <div ref="mapDiv" w-full h-400px mb-4 />
</template>
