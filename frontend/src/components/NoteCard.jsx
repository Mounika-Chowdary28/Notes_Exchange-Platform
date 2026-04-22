import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Eye, ThumbsUp, ThumbsDown, Bookmark, Star, FileText, Image, Calendar, User } from 'lucide-react'
import { useNotes } from '../context/NotesContext'
import { VoteControl } from './VoteControl'
import { BookmarkButton } from './BookmarkButton'
import { NoteBadges } from './NoteBadges'
import { QualityBadge } from './QualityBadge'

function FileBadge({ type }) {
  const configs = {
    pdf: { cls: 'bg-gradient-to-r from-rose-400/20 to-pink-400/20 text-rose-700 border border-rose-300/30', label: 'PDF', icon: FileText },
    docx: { cls: 'bg-gradient-to-r from-sky-400/20 to-blue-400/20 text-sky-700 border border-sky-300/30', label: 'DOCX', icon: FileText },
    img: { cls: 'bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-700 border border-emerald-300/30', label: 'IMG', icon: Image }
  }
  const config = configs[type] || configs.pdf
  const Icon = config.icon
  
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${config.cls}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  )
}

export function NoteCard({ note }) {
  const { score } = useNotes()
  const s = score(note)
  const noteId = note.id || note._id

  return (
    <motion.article 
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
    >
      {/* Top Actions */}
      <div className="absolute top-4 right-4 z-10">
        <BookmarkButton noteId={noteId} className="shadow-xl" />
      </div>
      
      <div className="relative flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FileBadge type={note.fileType} />
          <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 rounded-lg">
            {note.subjectCode}
          </span>
        </div>
        
        <Link to={`/notes/${noteId}`} className="group/title block mb-2">
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover/title:text-emerald-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {note.title}
          </h3>
        </Link>
        
        <p className="text-sm font-bold text-slate-500 mb-4 line-clamp-1">{note.subject}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="h-3 w-3 text-slate-400" />
            </div>
            <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{note.uploadedBy?.name || 'Student'}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
            Sem {note.semester} · {note.branch}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="h-4 w-4" />
                <span className="text-xs font-black">{note.views ?? 0}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Download className="h-4 w-4" />
                <span className="text-xs font-black">{note.downloads ?? 0}</span>
              </div>
            </div>
            
            <Link 
              to={`/notes/${noteId}`}
              className="h-9 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              View Note
            </Link>
          </div>

          <VoteControl noteId={noteId} className="w-full justify-center" />
        </div>
      </div>
    </motion.article>
  )
}
