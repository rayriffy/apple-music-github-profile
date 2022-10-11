import { useState, useEffect } from 'react'

export const useDebounce = <T = unknown>(initialValue: T, delay: number) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => setValue(initialValue), delay)
    return () => clearTimeout(handler)
  }, [initialValue, delay])

  return value
}
