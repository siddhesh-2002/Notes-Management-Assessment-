import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// ── Context ───────────────────────────────────────────────────────────────
const ThemeContext = createContext(null)

/**
 * ThemeProvider — wraps the app and exposes theme state + toggle.
 * Applies the `data-theme` attribute to <html> for CSS variable switching.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('notevault_theme', 'light')

  // Reflect theme on the root element so CSS variables take effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme — convenience hook for consuming theme context.
 * Must be used inside <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
