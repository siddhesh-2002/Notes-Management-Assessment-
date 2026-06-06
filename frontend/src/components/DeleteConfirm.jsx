import styles from './DeleteConfirm.module.css'

/**
 * DeleteConfirm — a minimal modal that asks the user to confirm
 * deletion before the note is permanently removed.
 *
 * Props:
 *  noteTitle  — string, displayed in the message
 *  onConfirm  — called when the user clicks "Delete"
 *  onClose    — called when the modal should close (Cancel or overlay click)
 */
export default function DeleteConfirm({ noteTitle, onConfirm, onClose }) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className={styles.modal}>
        {/* Icon */}
        <div className={styles.iconWrap} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v5M14 11v5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 id="delete-title" className={styles.title}>Delete note?</h2>

        <p className={styles.message}>
          <strong>"{noteTitle}"</strong> will be permanently deleted. This cannot be undone.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={handleConfirm}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  )
}
