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
</script>

<template>
  <div bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white rounded m-4 p-8 flex flex-col items-start text-left>
    <h2 text-xl font-bold>
      {{ station.brand }} {{ station.name }}
    </h2>
    <div>
      {{ station.street }} {{ station.postalCode }} {{ station.place }}
    </div>
    <!-- TODO: Generate a google maps navigation link -->
    <!-- <a href="">Set as navigation target</a> -->
    <div :class="{ 'text-green-500': station.isOpen, 'text-red-500': !station.isOpen }" class="py-4">
      {{ t('station.now') }} {{ station.isOpen ? t('station.open') : t('station.closed') }}
    </div>
    <div border border-gray-300 rounded w-max>
      <table>
        <tr v-for="fueltype in station.fuels" :key="fueltype.name" class="last:border-b-none border-b border-gray-300 ">
          <td class="p-2 border-r border-gray-300">
            {{ fueltype.name }}
          </td>
          <td class="p-2">
            {{ formatEuro(fueltype.price) }}
          </td>
        </tr>
      </table>
    </div>
    <OpeningTimes v-if="station.openingTimes.length !== 0" :opening-times="station.openingTimes" />
  </div>
</template>
