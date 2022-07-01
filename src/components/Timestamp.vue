<script setup lang="ts">
import { useTimestamp } from '~/composables/time'
const { time } = defineProps<{ time: string }>()
const { absolute, relative } = useTimestamp(time)
</script>

<template>
  <span v-tooltip.top="absolute">{{ relative }}</span>
</template>
