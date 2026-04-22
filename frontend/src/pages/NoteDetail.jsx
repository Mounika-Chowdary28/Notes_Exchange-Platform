import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Eye, Download, FileText, Star, Calendar, Tag, Award, Edit, Trash2, LogIn, MessageSquare, ZoomIn, BookOpen, User, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { BookmarkButton } from '../components/BookmarkButton'
import { CommentThread } from '../components/CommentThread'
import { NoteBadges } from '../components/NoteBadges'
import { NoteCard } from '../components/NoteCard'
import { PreviewModal } from '../components/PreviewModal'
import { QualityBadge } from '../components/QualityBadge'
import { ReportModal } from '../components/ReportModal'
import { VoteControl } from '../components/VoteControl'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'

function canEmbed(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:'))
}

export function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { reward } = useGamification()
  const { getNote, notes, score, bumpDownload, recordView, deleteNote } = useNotes()
  const { showToast } = useToast()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [ocrQ, setOcrQ] = useState('')
  const note = id ? getNote(id) : null

  useEffect(() => {
    if (note?.id) recordView(note.id)
  }, [note?.id, recordView])

  const related = useMemo(() => {
    if (!note) return []
    return notes
      .filter((n) => n.id !== note.id && (n.subjectCode === note.subjectCode || n.branch === note.branch))
      .slice(0, 3)
  }, [note, notes])

  const ocrHits = useMemo(() => {
    if (!note || !ocrQ.trim()) return []
    const t = ocrQ.toLowerCase()
    const pool = [note.title, note.description, note.subject, ...(note.tags || [])].join(' ').toLowerCase()
    return pool.includes(t) ? ['Title/metadata match', 'Tagged section', 'Simulated OCR chunk (demo)'] : []
  }, [note, ocrQ])

  if (!note) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-gray-200 py-16 text-center"
      >
        <div className="mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
          <Search className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="font-display text-2xl font-bold text-gray-700 mb-3">🔍 Note Not Found</h3>
        <p className="text-lg text-gray-600 mb-6">The note you're looking for doesn't exist or has been removed</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/browse" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105">
            <BookOpen className="h-5 w-5" />
            Browse All Notes
            <Search className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  const s = score(note)
  const previewPdf = note.fileType === 'pdf' && canEmbed(note.fileUrl)
  const isOwner = user?.id === note.uploadedBy?.id
  const noteId = note.id || note._id

  const onDownload = () => {
    bumpDownload(noteId, user?.id)
    reward('download')
    if (canEmbed(note.fileUrl)) {
      window.open(note.fileUrl, '_blank', 'noopener,noreferrer')
      showToast('Download / open started.', 'success')
      return
    }
    showToast('Demo file — download count updated. Connect API for real files.', 'info')
  }

  const onDelete = () => {
    if (!window.confirm('Delete this note permanently?')) return
    deleteNote(noteId)
    showToast('Note removed.', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} note={note} fileUrl={note.fileUrl} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} noteId={noteId} />

      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 p-2 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl"
      >
        <div className="flex items-center gap-2 px-4">
          <Link to="/browse" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Browse</Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{note.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={onDownload}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Note Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-600 uppercase tracking-wider">
                <Tag className="h-3.5 w-3.5" />
                {note.subjectCode}
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" />
                Sem {note.semester}
              </div>
              <QualityBadge note={note} />
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
              {note.title}
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
              {note.description || 'No description provided for this note.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">{note.views ?? 0}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">{note.downloads ?? 0}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">{s.up}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900">{note.unit || '1'}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</div>
              </div>
            </div>
          </motion.div>

          {/* Interaction Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
            <VoteControl noteId={noteId} />
            <div className="flex items-center gap-3">
              <BookmarkButton noteId={noteId} />
              <button 
                onClick={() => setReportOpen(true)}
                className="h-10 px-4 inline-flex items-center gap-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
              >
                <AlertCircle className="h-4 w-4" />
                Report
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-emerald-500" />
              Discussion
            </h3>
            <CommentThread note={note} />
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          {/* Uploader Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Uploaded By</h4>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                {(note.uploadedBy?.name || 'S')[0]}
              </div>
              <div>
                <div className="font-black text-slate-900">{note.uploadedBy?.name || 'Student'}</div>
                <div className="text-xs font-bold text-slate-500">{note.branch} · {note.subject}</div>
              </div>
            </div>
            
            {isOwner && (
              <div className="mt-6 flex gap-2">
                <Link 
                  to={`/edit-note/${noteId}`}
                  className="flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button 
                  onClick={onDelete}
                  className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Related Notes */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Related Content</h4>
            <div className="space-y-4">
              {related.map(n => (
                <NoteCard key={n.id} note={n} />
              ))}
              {related.length === 0 && (
                <p className="text-sm font-medium text-slate-400 italic">No similar notes found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
