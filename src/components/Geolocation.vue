<script setup lang="ts">
// TODO: use google gmaps lib to either try to identify position via celltowers, or let the user enter their current position manually
const { t } = useI18n()
const { coords, isSupported, error } = useGeolocation({ enableHighAccuracy: true })
</script>

<template>
  <div>
    <h1>Current coordinates:</h1>
    <div v-if="!isSupported || error" text-red-400>
      {{ t('geo.not-available') }}
    </div>
    <p v-if="coords">
      {{ coords.latitude }},
      {{ coords.longitude }}
    </p>
  </div>
</template>
