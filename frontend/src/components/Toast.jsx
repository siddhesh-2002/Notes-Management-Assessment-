import { useState, useEffect, useCallback } from 'react'
import styles from './Toast.module.css'

/* ── Toast store (module-level so it can be called from anywhere) ─────────── */
let _addToast = null

/**
 * showToast(message, type?)
 *   type: 'success' | 'error' | 'info'
 * Call this from anywhere in your app.
 */
export function showToast(message, type = 'success') {
  if (_addToast) _addToast(message, type)
}

/* ── ToastProvider ────────────────────────────────────────────────────────── */

/**
 * ToastProvider — render this once near the root of your app.
 * It mounts the toast container and registers the global showToast handler.
 */
export function ToastProvider() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  // Register globally
  useEffect(() => {
    _addToast = addToast
    return () => { _addToast = null }
  }, [addToast])

  if (!toasts.length) return null

  return (
    <div className={styles.container} aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span className={styles.icon} aria-hidden="true">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
