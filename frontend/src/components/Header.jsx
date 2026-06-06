import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import styles from './Header.module.css'

/**
 * Header — sticky top bar with:
 *  - Logo + app name
 *  - Search input (controlled by parent)
 *  - Dark/light mode toggle
 *  - "New Note" CTA button
 */
export default function Header({ search, onSearchChange, onNewNote }) {
  const { theme, toggleTheme } = useTheme()
  const searchRef = useRef(null)

  return (
    <header className={styles.header}>
      {/* ── Brand ─────────────────────────────────────────────────── */}
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" fill="currentColor" opacity=".25"/>
            <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className={styles.brandName}>NoteVault</span>
      </div>

      {/* ── Search ────────────────────────────────────────────────── */}
      <div className={styles.searchWrap}>
        <label htmlFor="note-search" className="sr-only">Search notes</label>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          id="note-search"
          ref={searchRef}
          type="search"
          className={styles.searchInput}
          placeholder="Search notes…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        {search && (
          <button
            className={styles.searchClear}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className={styles.actions}>
        {/* Theme toggle */}
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            /* Moon icon */
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.5 10.5A7 7 0 017.5 2.5a7 7 0 100 13 7 7 0 008-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            /* Sun icon */
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        {/* New note */}
        <button className={styles.newBtn} onClick={onNewNote}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Note
        </button>
      </div>
    </header>
  )
}
