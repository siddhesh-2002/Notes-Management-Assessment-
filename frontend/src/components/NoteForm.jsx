import { useState, useEffect, useRef } from 'react'
import styles from './NoteForm.module.css'

/* ── Constants ───────────────────────────────────────────────────────────── */
const MAX_CONTENT = 2000
const CATEGORIES = ['General', 'Work', 'Personal', 'Ideas', 'Todo', 'Learning']

const INITIAL = { title: '', content: '', category: 'General' }

/**
 * NoteForm — modal for creating or editing a note.
 *
 * Props:
 *  note?       — if provided, form is in "edit" mode
 *  onSave(data) — called with { title, content, category }
 *  onClose()   — called when the modal should close
 */
export default function NoteForm({ note, onSave, onClose }) {
  const isEdit = !!note
  const titleRef = useRef(null)

  const [fields, setFields] = useState(
    note
      ? { title: note.title, content: note.content, category: note.category }
      : INITIAL
  )
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Auto-focus title on mount
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  /* ── Field helpers ──────────────────────────────────────────── */
  const set = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear the error for this field as the user types
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  /* ── Validation ─────────────────────────────────────────────── */
  const validate = () => {
    const e = {}
    if (!fields.title.trim()) e.title = 'Title is required'
    else if (fields.title.trim().length < 2) e.title = 'Title must be at least 2 characters'
    if (!fields.content.trim()) e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Submit ─────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    // Simulate brief async save (replace with real API call if needed)
    setTimeout(() => {
      onSave({
        title: fields.title.trim(),
        content: fields.content.trim(),
        category: fields.category,
      })
      setSaving(false)
    }, 250)
  }

  /* ── Character counter status ───────────────────────────────── */
  const charCount = fields.content.length
  const charLeft = MAX_CONTENT - charCount
  const charClass = charLeft < 100 ? (charLeft < 0 ? styles.charOver : styles.charWarn) : ''

  const wordCount = fields.content.trim()
    ? fields.content.trim().split(/\s+/).length
    : 0

  return (
    /* Overlay — click outside to close */
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
      <div className={styles.modal}>
        {/* ── Modal header ──────────────────────────────────────── */}
        <div className={styles.modalHeader}>
          <h2 id="form-title" className={styles.modalTitle}>
            {isEdit ? 'Edit note' : 'New note'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="note-title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="note-title"
              ref={titleRef}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              type="text"
              placeholder="Give your note a title…"
              value={fields.title}
              onChange={set('title')}
              maxLength={120}
            />
            {errors.title && (
              <p className={styles.errorMsg} role="alert">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="note-category">
              Category
            </label>
            <select
              id="note-category"
              className={styles.select}
              value={fields.category}
              onChange={set('category')}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="note-content">
              Content <span className={styles.required}>*</span>
            </label>
            <textarea
              id="note-content"
              className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
              placeholder="Write your note here…"
              value={fields.content}
              onChange={set('content')}
              maxLength={MAX_CONTENT}
              rows={7}
            />
            {errors.content && (
              <p className={styles.errorMsg} role="alert">{errors.content}</p>
            )}
            {/* Character / word counter */}
            <div className={styles.counters}>
              <span className={styles.wordCount}>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
              <span className={`${styles.charCount} ${charClass}`}>
                {charCount} / {MAX_CONTENT}
              </span>
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────── */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
