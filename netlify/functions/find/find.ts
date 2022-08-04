import type { Handler } from '@netlify/functions'
import { byCoordinates } from 'tankerkoenigv4'

interface RequestParameters {
  lat: string
  lng: string
  rad?: string
}

const TANKERKOENIG_APIKEY = process.env.TANKERKOENIG_APIKEY ?? ''
// const REDIS_URL = process.env.REDIS_URL
// if (!REDIS_URL || REDIS_URL === '') {
//   throw new Error('cant connect to redis')
// }

// const client = new Redis(REDIS_URL)

export const handler: Handler = async (event) => {
  if (!TANKERKOENIG_APIKEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    }
  }

  const { lat, lng, rad = '2' } = event.queryStringParameters as unknown as RequestParameters

  const parsedLat = parseFloat(lat)
  const parsedLng = parseFloat(lng)
  const parsedRadius = parseFloat(rad)

  if (!parsedLat || !parsedLng || !parsedRadius) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request',
      }),
    }
  }

  const stations = await byCoordinates({ apikey: TANKERKOENIG_APIKEY, lat: parsedLat, lng: parsedLng, rad: parsedRadius })

  return {
    statusCode: 200,
    body: JSON.stringify(stations),
    headers: {
      'Cache-Control': `max-age=${60}`
    },
  }
}
