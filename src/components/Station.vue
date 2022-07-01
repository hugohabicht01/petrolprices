<script setup lang="ts">
// TODO: Make it possible to pass the users selected fuel type, so that only that will be displayed
// TODO: another thought should be given to the idea of having a 'collapsed' and an 'expanded' state, with little and very detailed information
import type { CoordinatesResult } from 'tankerkoenigv4/built/types'

interface Station {
  station: CoordinatesResult['stations'][number]
}
const { station } = defineProps<Station>()
const { t } = useI18n()
const formatEuro = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount).toString()

// Often the name also includes the brand, thats why we're gonna try to remove it
const stationName = computed(() => {
  const nameTrimmed = station.name ? station.name.trim() : undefined
  const brandTrimmed = station.brand ? station.brand.trim() : undefined

  if (nameTrimmed && brandTrimmed && nameTrimmed?.startsWith(brandTrimmed)) {
    const name = nameTrimmed.replace(brandTrimmed, '').trim()
    return [brandTrimmed, name].join(' ')
  }
  return [station.brand, station.name].filter(Boolean).join(' ')
})

const stationAddress = computed(() => [station.street, station.postalCode, station.place].filter(Boolean).join(' '))

const navigationLink = computed(() => {
  const gmapsNavigationUrl = new URL('https://www.google.com/maps/dir/')
  const params = new URLSearchParams({ 'api': '1', 'destination': stationAddress.value, 'travelmode': 'driving' })
  gmapsNavigationUrl.search = params.toString()
  return gmapsNavigationUrl.toString()
})

</script>

<template>
  <div bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white rounded m-4 p-8 flex flex-col items-start text-left>
    <h2 text-xl font-bold>
      {{ stationName }}
    </h2>
    <div>
      {{ stationAddress }}
    </div>
    <!-- TODO: Generate a google maps navigation link -->
    <!-- <a href="">Set as navigation target</a> -->
    <div :class="{ 'text-green-500': station.isOpen, 'text-red-500': !station.isOpen }" class="py-4">
      {{ t('station.now') }} {{ station.isOpen ? t('station.open') : t('station.closed') }}
    </div>
    <div border border-gray-300 rounded w-max self-center>
      <table>
        <Price v-for="fueltype in station.fuels" :key="fueltype.name"
          class="last:border-b-none border-b border-gray-300 " :fuel="fueltype" />
      </table>
    </div>
    <OpeningTimes v-if="station?.openingTimes?.length !== 0" :opening-times="station.openingTimes" />
    <a :href="navigationLink" target="_blank" dark:bg-gray-200 dark:text-gray-700 bg-gray-300 py-2 px-4 mt-6 self-center
      rounded>Open Navigation</a>
  </div>
</template>
