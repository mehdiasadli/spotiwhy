import { useState, useEffect } from 'react'
function useDebounce<T>(value: T, delay?: number): T {
  const [debounceVal, setDebounceVal] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounceVal(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])

  return debounceVal
}

export default useDebounce
