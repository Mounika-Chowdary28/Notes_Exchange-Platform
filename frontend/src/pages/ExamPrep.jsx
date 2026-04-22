import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, FileText, TrendingUp, Clock, Award, Target, BookOpen, Star, Eye, Download, Zap, Calendar, Brain } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../context/NotesContext'
import { filterAndSortNotes } from '../utils/noteFilters'

export function ExamPrep() {
  const { notes, score } = useNotes()
  const top = useMemo(
    () =>
      filterAndSortNotes(notes, { sort: 'top', examOnly: true, pyqOnly: false }, score).slice(0, 6),
    [notes, score]
  )
  const pyq = useMemo(
    () => filterAndSortNotes(notes, { pyqOnly: true, sort: 'downloads' }, score).slice(0, 6),
    [notes, score]
  )
  const revision = useMemo(
    () =>
      notes
        .filter((n) => n.noteType === 'revision' || n.noteType === 'cheat_sheet' || n.bestForExams)
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 6),
    [notes]
  )
  const hot = useMemo(
    () => [...notes].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    [notes]
  )

  return (
    <div className="space-y-12">
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 p-6 mb-6 shadow-2xl">
          <GraduationCap className="h-12 w-12 text-white" />
          <h1 className="font-display text-3xl font-bold text-white">Exam Prep Mode</h1>
          <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          🎯 One screen for top-rated materials, PYQs, revision sets, and what's trending by views this week
        </p>
        <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border border-blue-200">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{top.length} Top Rated</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">{pyq.length} PYQs</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">{revision.length} Revision</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">{hot.length} Trending</span>
          </div>
        </div>
      </motion.header>
      {[
        { 
          title: '🏆 Top-rated exam-focused', 
          items: top,
          icon: Award,
          color: 'from-blue-500 to-purple-500',
          description: 'Highest rated materials for exam preparation'
        },
        { 
          title: '📄 Previous year & papers', 
          items: pyq,
          icon: FileText,
          color: 'from-orange-500 to-red-500',
          description: 'Previous year questions and exam papers'
        },
        { 
          title: '📚 Revision & cheat sheets', 
          items: revision,
          icon: BookOpen,
          color: 'from-green-500 to-teal-500',
          description: 'Quick revision guides and cheat sheets'
        },
        { 
          title: '🔥 Most viewed lately', 
          items: hot,
          icon: TrendingUp,
          color: 'from-pink-500 to-rose-500',
          description: 'Trending materials based on recent views'
        },
      ].map((sec, index) => (
        <motion.section
          key={sec.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
          className="glass-enhanced rounded-3xl border border-blue-500/20 p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3">
              <sec.icon className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">{sec.title}</h2>
            <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 text-xs font-bold text-blue-700">
              <Star className="h-3 w-3" />
              {sec.items.length} Items
            </div>
          </motion.div>
          
          <p className="text-sm text-gray-600 mb-4">{sec.description}</p>
          
          {sec.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center py-12"
            >
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-50 flex items-center justify-center">
                <sec.icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-700 mb-2">No items found</h3>
              <p className="text-sm text-gray-500">Check back later for new content</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {sec.items.map((note, noteIndex) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + noteIndex * 0.1 }}
                >
                  <NoteCard note={note} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>
      ))}
    </div>
  )
}
