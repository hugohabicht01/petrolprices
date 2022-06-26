import dayjs from 'dayjs'
import { ref, unref } from 'vue'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { type MaybeRef } from '~/types'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

// This is the format the API usually returns
export const parseTimestamp = (date: string) => dayjs(date, "YYYY-MM-DDTHH:mm-ss")


export const useTimestamp = (timestamp: MaybeRef<string>, refreshThreshold = 10_000) => {
  // These two can be changed to force a recomputation
  const refreshToken = useInterval(refreshThreshold)
  const valueChangedToken = ref(0)

  const parsed = ref(parseTimestamp(unref(timestamp)))

  if (isRef(timestamp)) {
    watch(timestamp, () => {
      parsed.value = parseTimestamp(unref(timestamp))
      refreshToken.value = refreshToken.value + 1
      valueChangedToken.value = valueChangedToken.value + 1
    })
  }

  const relative = computed(() => {
    refreshToken.value = refreshToken.value
    return parsed.value.fromNow()
  })

  const absolute = computed(() => {
    valueChangedToken.value = valueChangedToken.value
    return parsed.value.format('HH:mm:ss')
  })

  return { relative, absolute }
}
