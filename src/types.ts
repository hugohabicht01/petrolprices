import { type ViteSSGContext } from 'vite-ssg'
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
