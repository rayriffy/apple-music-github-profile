import { Dispatch, SetStateAction, useState } from 'react'

import { useDebounce } from './useDebounce'

export const useDebounceState = <T = unknown>(
  initialValue: T,
  delay: number
): [T, Dispatch<SetStateAction<T>>, T] => {
  const [value, setValue] = useState(initialValue)
  const debounceValue = useDebounce(value, delay)

  return [value, setValue, debounceValue]
}
