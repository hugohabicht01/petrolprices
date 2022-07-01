import dayjs from 'dayjs'
import { ref, unref } from 'vue'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { type MaybeRef } from '~/types'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

// This is the format the API usually returns
export const parseTimestamp = (date: string, format = "YYYY-MM-DDTHH:mm-ss") => dayjs(date, format)


export const useTimestamp = (timestamp: MaybeRef<string>, refreshThreshold = 10_000) => {
  const parsed = ref(parseTimestamp(unref(timestamp)))

  const calcRelative = () => parsed.value.fromNow()
  const calcAbsolute = () => parsed.value.format('HH:mm:ss')

  const relative = ref(calcRelative())

  const absolute = ref(calcAbsolute())

  if (isRef(timestamp)) {
    watch(timestamp, () => {
      parsed.value = parseTimestamp(unref(timestamp))
      relative.value = calcRelative()
      absolute.value = calcAbsolute()
    })
  }

  useIntervalFn(() => {
    relative.value = calcRelative()
  }, refreshThreshold)

  const recalculate = () => {
    relative.value = calcRelative()
    absolute.value = calcAbsolute()
  }

  return { relative, absolute, recalculate }
}
