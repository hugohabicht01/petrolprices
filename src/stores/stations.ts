import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import { $fetch } from 'ohmyfetch'
import type * as types from '~/types'

interface IStationsStores {
  prices?: types.PetrolPrices
  coords?: Ref<GeolocationCoordinates>
}

export const useStationsStore = defineStore('stations', () => {

})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStationsStore, import.meta.hot))
