<script setup lang="ts">
// TODO: Make it possible to pass the users selected fuel type, so that only that will be displayed
// TODO: another thought should be given to the idea of having a 'collapsed' and an 'expanded' state, with little and very detailed information
import type { CoordinatesResult } from 'tankerkoenigv4/built/types'

interface Fuel {
  fuel: CoordinatesResult['stations'][number]['fuels'][number]
}

const { fuel } = defineProps<Fuel>()
const { t } = useI18n()
const formatEuro = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount).toString()

const formattedPrice = computed(() => formatEuro(fuel.price))
const priceIncreased = computed(() => fuel.lastChange?.amount > 0)
const priceChangedBy = computed(() => formatEuro(Math.abs(fuel.lastChange?.amount)))
</script>

<template>
  <tr last:border-b-none border-b border-gray-300>
    <td class="p-2 border-r border-gray-300">
      {{ fuel.name }}
    </td>
    <VTooltip>
      <td class="p-2" :class="{ 'text-green-500': !priceIncreased, 'text-red-500': priceIncreased }">
        {{ formattedPrice }}
      </td>
      <template #popper>
        <div v-if="fuel.lastChange?.timestamp"
          :class="{ 'text-green-500': !priceIncreased, 'text-red-500': priceIncreased }">
          <span>{{ priceIncreased ? t('price.increased') : t('price.decreased') }}&nbsp;</span>
          <span>
            {{ priceChangedBy }}&nbsp;
          </span>
          <span>
            <Timestamp :time="fuel.lastChange?.timestamp" />
          </span>
        </div>
      </template>
    </VTooltip>
  </tr>
</template>
