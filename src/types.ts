import { type ViteSSGContext } from 'vite-ssg'
import { type Ref } from 'vue'
import type { CoordinatesResult } from 'tankerkoenigv4/built/types'

export type PetrolPrices = CoordinatesResult

export type UserModule = (ctx: ViteSSGContext) => void
export interface PetrolStationsData {
  data?: CoordinatesResult
}

export interface LatLng {
  lat: number
  lng: number
}

/**
 * Maybe it's a ref, or not.
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>

