import { useState, useEffect } from 'react'

/**
 * useLocalStorage — drop-in replacement for useState that persists
 * the value in localStorage under the given key.
 *
 * @param {string} key        localStorage key
 * @param {*}      initialValue  default value if key not present
 * @returns [value, setValue]  same API as useState
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (err) {
      console.warn(`useLocalStorage: error reading key "${key}"`, err)
      return initialValue
    }
  })

  // Sync to localStorage whenever the value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (err) {
      console.warn(`useLocalStorage: error writing key "${key}"`, err)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
