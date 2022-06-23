import v3gmaps from 'v3-gmaps'
import { type UserModule } from '~/types'

let GOOGLE_MAPS_APIKEY = 'AIzaSyA7hIehrKYoBwLICdOM6er-4R06sUHSa_w'

if (import.meta.env.DEV === true) {
  // While development we use an unrestricted API key, the main key is restricted to v2.cyborgs.tech
  GOOGLE_MAPS_APIKEY = import.meta.env.VITE_GOOGLE_MAPS_APIKEY as unknown as string
  console.log('Using Google Maps API key from environment:', GOOGLE_MAPS_APIKEY)
}

export const install: UserModule = ({ app }) => {
  app.use(v3gmaps, { key: GOOGLE_MAPS_APIKEY, libraries: ['geometry', 'drawing'] })
}
