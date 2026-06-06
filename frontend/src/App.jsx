import { useState, useMemo } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import NoteCard from './components/NoteCard'
import NoteForm from './components/NoteForm'
import DeleteConfirm from './components/DeleteConfirm'
import { ToastProvider, showToast } from './components/Toast'
import styles from './App.module.css'

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Generate a short unique ID */
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2)

const now = () => new Date().toISOString()

/* ── Sample data for first run ───────────────────────────────────────────── */
const SAMPLE_NOTES = [
  {
    id: uid(),
    title: 'Welcome to NoteVault! 🎉',
    content:
      'This is your personal note management system. Create, edit, search, and delete notes easily. Toggle dark mode with the button in the top-right corner. All your notes are saved automatically in your browser.',
    category: 'General',
    createdAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86_400_000 * 2).toISOString(),
  },
  {
    id: uid(),
    title: 'React Hooks quick reference',
    content:
      'useState — local component state\nuseEffect — side effects & lifecycle\nuseCallback — memoized callbacks\nuseMemo — expensive computations\nuseRef — mutable refs / DOM access\nuseContext — consume React context\nuseReducer — complex state logic',
    category: 'Learning',
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: uid(),
    title: 'Project ideas for this year',
    content:
      '1. SaaS note-taking app with team collaboration\n2. AI-powered writing assistant\n3. Habit tracker with streak visualization\n4. Personal finance dashboard\n5. Recipe manager with smart shopping list',
    category: 'Ideas',
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
]

/* ── Sort options ─────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az',     label: 'A → Z' },
  { value: 'za',     label: 'Z → A' },
]

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Ideas', 'Todo', 'Learning']

/* ─────────────────────────────────────────────────────────────────────────── */
/*  AppContent — needs to live inside ThemeProvider                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function AppContent() {
  // ── Persisted state ──────────────────────────────────────────────────────
  const [notes, setNotes] = useLocalStorage('notevault_notes', SAMPLE_NOTES)

  // ── UI state ─────────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('')
  const [sort, setSort]             = useState('newest')
  const [category, setCategory]     = useState('All')
  const [showForm, setShowForm]     = useState(false)
  const [editNote, setEditNote]     = useState(null)   // note object | null
  const [deleteId, setDeleteId]     = useState(null)   // note id | null

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  /** Create a new note */
  const handleCreate = (data) => {
    const note = { id: uid(), ...data, createdAt: now(), updatedAt: now() }
    setNotes((prev) => [note, ...prev])
    setShowForm(false)
    showToast('Note created!', 'success')
  }

  /** Save edits to an existing note */
  const handleUpdate = (data) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editNote.id ? { ...n, ...data, updatedAt: now() } : n
      )
    )
    setEditNote(null)
    showToast('Note updated!', 'success')
  }

  /** Delete a note (called after confirmation) */
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    showToast('Note deleted', 'error')
  }

  // ── Filtered & sorted notes ───────────────────────────────────────────────
  const displayed = useMemo(() => {
    let result = notes

    // Category filter
    if (category !== 'All') {
      result = result.filter((n) => n.category === category)
    }

    // Search filter (case-insensitive, searches title + content)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'az')     return a.title.localeCompare(b.title)
      if (sort === 'za')     return b.title.localeCompare(a.title)
      return 0
    })
  }, [notes, search, sort, category])

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalNotes   = notes.length
  const totalWords   = notes.reduce(
    (acc, n) => acc + (n.content.trim() ? n.content.trim().split(/\s+/).length : 0),
    0
  )

  return (
    <div className={styles.app}>
      {/* ── Top navigation ──────────────────────────────────────── */}
      <Header
        search={search}
        onSearchChange={setSearch}
        onNewNote={() => setShowForm(true)}
      />

      <main className={styles.main}>
        {/* ── Stats bar ─────────────────────────────────────────── */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total notes</span>
            <span className={styles.statValue}>{totalNotes}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total words</span>
            <span className={styles.statValue}>{totalWords.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Showing</span>
            <span className={styles.statValue}>{displayed.length}</span>
          </div>
        </div>

        {/* ── Toolbar: category filter + sort ───────────────────── */}
        <div className={styles.toolbar}>
          {/* Category filter tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={category === cat}
                className={`${styles.filterTab} ${category === cat ? styles.filterTabActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort select */}
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort notes"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Notes grid ────────────────────────────────────────── */}
        {displayed.length > 0 ? (
          <div className={styles.grid}>
            {displayed.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={setEditNote}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              {search ? '🔍' : '📋'}
            </div>
            <h2 className={styles.emptyTitle}>
              {search ? 'No matching notes' : 'No notes yet'}
            </h2>
            <p className={styles.emptySub}>
              {search
                ? `No notes match "${search}". Try a different keyword.`
                : 'Click "New Note" to create your first note.'}
            </p>
            {!search && (
              <button
                className={styles.emptyAction}
                onClick={() => setShowForm(true)}
              >
                + Create your first note
              </button>
            )}
          </div>
        )}

        {/* Search result count */}
        {search && displayed.length > 0 && (
          <p className={styles.resultCount}>
            {displayed.length} result{displayed.length !== 1 ? 's' : ''} for &quot;{search}&quot;
          </p>
        )}
      </main>

      {/* ── Modals ────────────────────────────────────────────────── */}

      {/* Create note modal */}
      {showForm && (
        <NoteForm
          onSave={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit note modal */}
      {editNote && (
        <NoteForm
          note={editNote}
          onSave={handleUpdate}
          onClose={() => setEditNote(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <DeleteConfirm
          noteTitle={notes.find((n) => n.id === deleteId)?.title ?? ''}
          onConfirm={() => handleDelete(deleteId)}
          onClose={() => setDeleteId(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastProvider />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  App — wraps everything in providers                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
