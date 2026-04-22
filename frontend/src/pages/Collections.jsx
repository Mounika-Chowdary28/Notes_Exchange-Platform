import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, Folder, BookOpen, Tag, Plus, Search, Filter, Star, Heart, Archive, Settings, CheckCircle, AlertCircle } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

export function Collections() {
  const { collections, addCollection, toggleNoteInCollection, notes } = useNotes()
  const { showToast } = useToast()
  const [name, setName] = useState('Exam Week')
  const [pickCol, setPickCol] = useState('')
  const [pickNote, setPickNote] = useState('')

  // Sync selection when data loads
  useEffect(() => {
    if (!pickNote && notes.length > 0) setPickNote(notes[0].id)
    if (!pickCol && collections.length > 0) setPickCol(collections[0].id)
  }, [notes, collections, pickNote, pickCol])

  const activeColId = pickCol || collections[0]?.id || ''

  const create = () => {
    const c = addCollection(name)
    setPickCol(c.id)
    showToast('Collection created.', 'success')
    setName('Exam Week')
  }

  const col = collections.find((c) => c.id === activeColId)
  const colNotes = (col?.noteIds || []).map((id) => notes.find((n) => n.id === id)).filter(Boolean)

  return (
    <div className="space-y-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-600">
            <Archive className="h-4 w-4" />
            <span>Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Your <span className="text-orange-500">Collections.</span>
          </h1>
          <p className="text-lg font-medium text-slate-600">
            Curate sets like "Exam Week", "DBMS Important", or "Placement prep" to keep your study materials organized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
            <Folder className="h-4 w-4" />
            {collections.length} Collections
          </div>
        </div>
      </motion.header>

      <div className="glass-enhanced rounded-3xl border border-slate-200 p-8">
        <div className="flex flex-wrap items-end gap-4 mb-10">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Collection Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-5 rounded-xl border-2 border-slate-100 bg-white text-sm font-bold text-slate-900 transition-all focus:border-orange-500 focus:ring-0"
              placeholder="e.g. Exam Week"
            />
          </div>
          
          <motion.button
            type="button"
            onClick={create}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 px-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-orange-600 transition-all"
          >
            <FolderPlus className="h-5 w-5" />
            Create Collection
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Folder className="h-4 w-4 text-orange-500" />
              Active Collection
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={activeColId}
              onChange={(e) => setPickCol(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-orange-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-orange-300 focus:border-orange-500"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  📁 {c.name}
                </option>
              ))}
            </motion.select>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Plus className="h-4 w-4 text-orange-500" />
              Add Note
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={pickNote}
              onChange={(e) => setPickNote(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-orange-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-orange-300 focus:border-orange-500"
            >
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  📚 {n.subjectCode} — {n.title}
                </option>
              ))}
            </motion.select>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <motion.button
            type="button"
            onClick={() => {
              if (!activeColId || !pickNote) return
              toggleNoteInCollection(activeColId, pickNote)
              showToast('Collection updated.', 'success')
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:scale-105"
          >
            <Settings className="h-5 w-5" />
            <span>Toggle Selected Note</span>
            <Star className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>
      </div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-orange-500/20 p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-3">
            <Folder className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            {col?.name || '📁 Pick a Collection'}
          </h2>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 px-3 py-1 text-xs font-bold text-orange-700">
            <BookOpen className="h-3 w-3" />
            {colNotes.length} Notes
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {colNotes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="col-span-2 text-center py-12"
            >
              <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center">
                <Folder className="h-12 w-12 text-orange-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-700 mb-3">📭 Empty Collection</h3>
              <p className="text-lg text-gray-600 mb-4">Add some notes to this collection!</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>💡 Select a collection from above</p>
                <p>📚 Choose notes to add</p>
                <p>🎚 Click "Toggle Selected Note" to add/remove</p>
              </div>
            </motion.div>
          ) : (
            colNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <NoteCard note={note} />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.section>
    </div>
  )
}
