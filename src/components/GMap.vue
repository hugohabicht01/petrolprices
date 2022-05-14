<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import type { PetrolStationsData } from '~/types'
import RawIconGasStation from '~icons/mdi/gas-station?raw&width=2em&height=2em'

const parser = new DOMParser()
const parsed = parser.parseFromString(RawIconGasStation as unknown as string, 'text/html')
const pathEl = parsed.querySelector('path') as SVGPathElement

// Fallback coords, in case we can't retrieve the user's location
// This coordinate is pretty much the middle of Berlin
const fallBackCoords = { lat: 52.5232, lng: 13.4127 }

const GOOGLE_MAPS_APIKEY = 'AIzaSyA7hIehrKYoBwLICdOM6er-4R06sUHSa_w'

const loader = new Loader({
  apiKey: GOOGLE_MAPS_APIKEY,
})
const mapDiv = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)

const { data } = defineProps<PetrolStationsData>()
const emit = defineEmits<{ (e: 'selected', id: string): void }>()

onMounted(async () => {
  const { coords } = useGeolocation({ enableHighAccuracy: true })
  const latlng = computed(() => ({
    lat: coords.value.latitude === Infinity ? fallBackCoords.lat : coords.value.latitude,
    lng: coords.value.longitude === Infinity ? fallBackCoords.lng : coords.value.longitude
  }))
  await loader.load()
  if (mapDiv.value) {
    map.value = new google.maps.Map(mapDiv.value, {
      center: latlng.value,
      zoom: 8,
      clickableIcons: false,
    })

    const marker = new google.maps.Marker({
      position: latlng.value,
      map: map.value,
    })

    watchEffect(() => {
      if (map.value) {
        marker.setPosition(latlng.value)
        map.value.setCenter(latlng.value)
      }
    })

    const stationMarkers = ref<google.maps.Marker[]>([])

    const PetrolStationIcon: google.maps.Symbol = {
      strokeColor: 'black',
      fillColor: 'black',
      fillOpacity: 1,
      strokeOpacity: 1,
      strokeWeight: 0.01,
      scale: 2,
      anchor: new google.maps.Point(9, 21),
      path: (pathEl.attributes.getNamedItem('d') as Attr).value,
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
        marker.addListener('click', () => emit('selected', station.id))
        stationMarkers.value.push(marker)
      })
    },
    { immediate: true })
  }
})
</script>

<template>
  <div ref="mapDiv" w-full h-400px mb-4 />
</template>
