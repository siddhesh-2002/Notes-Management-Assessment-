import styles from './NoteCard.module.css'

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Format ISO date string to "Jan 1, 2025" */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Truncate content preview to ~160 characters */
function preview(text, max = 160) {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

/* ── Category color map ──────────────────────────────────────────────────── */
const CAT_COLORS = {
  General: 'purple',
  Work: 'blue',
  Personal: 'pink',
  Ideas: 'amber',
  Todo: 'green',
  Learning: 'teal',
}

/**
 * NoteCard — displays a single note in the grid.
 *
 * Props:
 *  note      — note object { id, title, content, category, createdAt, updatedAt }
 *  onEdit    — called with the note object when edit is clicked
 *  onDelete  — called with note.id when delete is clicked
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  const catColor = CAT_COLORS[note.category] || 'purple'
  const wasUpdated = note.updatedAt !== note.createdAt

  const handleDelete = (e) => {
    e.stopPropagation() // Don't trigger card click
    onDelete(note.id)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(note)
  }

  return (
    <article
      className={styles.card}
      onClick={() => onEdit(note)}
      role="button"
      tabIndex={0}
      aria-label={`Open note: ${note.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(note)}
    >
      {/* ── Category badge ─────────────────────────────────────── */}
      <span className={`${styles.badge} ${styles[`badge_${catColor}`]}`}>
        {note.category}
      </span>

      {/* ── Title ──────────────────────────────────────────────── */}
      <h2 className={styles.title}>{note.title}</h2>

      {/* ── Content preview ────────────────────────────────────── */}
      <p className={styles.content}>{preview(note.content)}</p>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.dates}>
          <span className={styles.dateLabel}>
            {wasUpdated ? 'Updated' : 'Created'}&nbsp;
            {formatDate(wasUpdated ? note.updatedAt : note.createdAt)}
          </span>
        </div>

        {/* Action buttons — stop propagation so card click doesn't fire */}
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            className={`${styles.actionBtn} ${styles.editBtn}`}
            onClick={handleEdit}
            aria-label={`Edit note: ${note.title}`}
            title="Edit"
          >
            {/* Pencil icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9.5 2L12 4.5l-7 7H2.5V9L9.5 2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete}
            aria-label={`Delete note: ${note.title}`}
            title="Delete"
          >
            {/* Trash icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9L11 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  )
}
