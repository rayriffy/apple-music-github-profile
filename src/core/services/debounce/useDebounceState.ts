import { useState } from 'react'

import { useDebounce } from './useDebounce'

export const useDebounceState = <T = unknown>(
  initialValue: T,
  delay: number
) => {
  const [value, setValue] = useState(initialValue)
  const debounceValue = useDebounce(value, delay)

  return [value, setValue, debounceValue]
}
