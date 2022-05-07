import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import type * as types from '~/types'

interface IStationsStores {
  prices?: types.PetrolPrices
  coords: Ref<GeolocationCoordinates>
}

export const useStationsStore = defineStore('stations', {
  state: (): IStationsStores => {
    const { coords } = useGeolocation({ enableHighAccuracy: true })
    return { prices: undefined, coords }
  },
  actions: {
    async fetchStations() {
      const { latitude: lat, longitude: lng } = this.coords
      if (lat === Infinity || lng === Infinity)
        return

      const prices = await $fetch('/api/find', {
        params: {
          lat,
          lng,
        },
      })
      this.prices = prices
    }
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStationsStore, import.meta.hot))
