import { acceptHMRUpdate, defineStore } from 'pinia'
import { useLocation } from '~/composables/location'

// This store has the single purpose of making a single instance of useLocation,
// which then can be imported everywhere,
// so that all different components use this single source of truth
export const useLocationStore = defineStore('location', () => {
  let location = useLocation()
  const reset = () => { location = useLocation() }
  return { ...location, reset }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLocationStore, import.meta.hot))
