<script setup lang="ts">
// FIXME: The borders aren't quite right yet, and it needs some testing. Maybe even an opportunity to try out vitest
// TODO: use i18n to translate these days to the user locale
// TODO: add some logic to detect 24 hour opening times
interface IOpeningTimes {
  openingTimes?: {
    days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'hol')[]
    times?: {
      open?: string
      close?: string
    }[]
  }[]
}
const { openingTimes } = defineProps<IOpeningTimes>()
const { t } = useI18n()
</script>

<template>
  <h4 class="text-lg">
    {{ t('station.openingTimes') }}:
  </h4>
  <div class="border border-gray-300 w-max">
    <table>
      <template v-for="datapoint in openingTimes" :key="datapoint.days">
        <tr v-for="(day) in datapoint.days" :key="day" even:border-b border-sky-300>
          <td p-2 border-sky-300 border-r>
            {{ day }}
          </td>
          <td p-2>
            {{ datapoint?.times?.[0]?.open }} {{ t('station.until') }} {{ datapoint?.times?.[0]?.close }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
