import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Upload, Bookmark, Star, Award, TrendingUp, Target, BookOpen, Download, Eye, User, Settings, Sparkles, Zap } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'

export function Dashboard() {
  const { user, updateProfile } = useAuth()
  const { notes, bookmarks, downloadLog, recentViews, getNote } = useNotes()
  const { points, badges, badgeMeta, uploadsByMe } = useGamification()

  const mine = useMemo(() => notes.filter((n) => n.uploadedBy?.id === user?.id), [notes, user?.id])
  const saved = useMemo(() => notes.filter((n) => bookmarks.has(n.id)), [notes, bookmarks])
  const recent = useMemo(
    () => recentViews.map((id) => getNote(id)).filter(Boolean).slice(0, 6),
    [recentViews, getNote]
  )
  const myDownloads = useMemo(
    () => downloadLog.filter((d) => d.userId === user?.id).slice(0, 8),
    [downloadLog, user?.id]
  )

  return (
    <div className="space-y-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-3">
              <User className="h-8 w-8 text-white" />
            </div>
             Hi {user?.name || 'Student'} 
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          </h1>
          <p className="mt-3 text-lg text-gray-600">📚 Uploads, 📥 downloads, 🔖 saved notes, 📈 stats, 🏆 reputation.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/upload" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-105">
            <Upload className="h-5 w-5" />
            New Upload
            <Zap className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </motion.header>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="glass-enhanced group relative overflow-hidden rounded-3xl border border-emerald-500/20 p-6 transition-all hover:shadow-xl hover:shadow-emerald-500/20"
        >
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Reputation Score
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-emerald-600">{points}</p>
              <p className="mt-2 text-sm text-gray-600">🎯 Points + upload weighting</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-3">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">Top Contributor</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="glass-enhanced group relative overflow-hidden rounded-3xl border border-cyan-500/20 p-6 transition-all hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-transparent blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Contributions
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-cyan-600">{uploadsByMe}</p>
              <p className="mt-2 text-sm text-gray-600">📝 Notes you published</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 p-3">
              <Upload className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-medium text-cyan-600">Active Creator</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="glass-enhanced group relative overflow-hidden rounded-3xl border border-orange-500/20 p-6 transition-all hover:shadow-xl hover:shadow-orange-500/20"
        >
          <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gradient-to-br from-orange-400/20 to-transparent blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-orange-600">{saved.length}</p>
              <p className="mt-2 text-sm text-gray-600">🔖 Bookmarked notes</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 p-3">
              <Bookmark className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium text-orange-600">Curated Collection</span>
          </div>
        </motion.div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-purple-500/20 p-8"
      >
        <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-2">
            <Settings className="h-6 w-6 text-white" />
          </div>
          Profile Settings
          <Sparkles className="h-6 w-6 text-purple-500" />
        </h2>
        <p className="mt-3 text-gray-600">🎯 Customize your profile for better recommendations</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <motion.label 
            whileHover={{ scale: 1.02 }}
            className="text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Branch
            </div>
            <select
              defaultValue={user?.branch}
              onChange={(e) => updateProfile({ branch: e.target.value })}
              className="focus-ring mt-1 w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              {['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT'].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </motion.label>
          <motion.label 
            whileHover={{ scale: 1.02 }}
            className="text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              Semester
            </div>
            <select
              defaultValue={user?.semester}
              onChange={(e) => updateProfile({ semester: Number(e.target.value) })}
              className="focus-ring mt-1 w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </motion.label>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-2">
            <Award className="h-6 w-6 text-white" />
          </div>
          Achievements & Badges
          <Star className="h-6 w-6 text-yellow-500" />
        </h2>
        <p className="mt-3 text-gray-600">🏆 Unlock achievements by contributing to the community</p>
        <div className="mt-6">
          {badges.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-enhanced rounded-2xl border border-gray-200 p-8 text-center"
            >
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <Award className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">🎯 Start Your Journey!</p>
              <p className="text-sm text-gray-500">Upload notes and engage with the community to unlock amazing badges 🏅</p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {badges.map((b, index) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  title={badgeMeta[b]?.label}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative glass-enhanced rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{badgeMeta[b]?.icon || '🏆'}</span>
                      <span className="text-sm font-bold text-yellow-700">{badgeMeta[b]?.label || b}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-2">
            <Upload className="h-6 w-6 text-white" />
          </div>
          My Uploads
          <Star className="h-6 w-6 text-blue-500" />
        </h2>
        <p className="mt-3 text-gray-600">📝 Your contributions to the community</p>
        <div className="mt-6">
          {mine.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-enhanced rounded-2xl border border-gray-200 p-8 text-center"
            >
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-50 flex items-center justify-center">
                <Upload className="h-12 w-12 text-blue-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">🚀 Start Sharing!</p>
              <p className="text-sm text-gray-500 mb-4">Share your first note to help other students succeed 📚</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/upload" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl">
                  <Upload className="h-5 w-5" />
                  Upload First Note
                  <Zap className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {mine.map((n, index) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NoteCard note={n} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 p-2">
            <Eye className="h-6 w-6 text-white" />
          </div>
          Recently Viewed
          <TrendingUp className="h-6 w-6 text-green-500" />
        </h2>
        <p className="mt-3 text-gray-600">👀 Your recent browsing history</p>
        <div className="mt-6">
          {recent.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-enhanced rounded-2xl border border-gray-200 p-8 text-center"
            >
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-teal-50 flex items-center justify-center">
                <Eye className="h-12 w-12 text-green-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">🔍 Explore Notes!</p>
              <p className="text-sm text-gray-500">Start browsing to build your learning history 📚</p>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {recent.map((n, index) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NoteCard note={n} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <h2 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
            <Download className="h-6 w-6 text-white" />
          </div>
          My Downloads
          <Bookmark className="h-6 w-6 text-indigo-500" />
        </h2>
        <p className="mt-3 text-gray-600">📥 Your download history while signed in</p>
        <div className="mt-6">
          {myDownloads.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-enhanced rounded-2xl border border-gray-200 p-8 text-center"
            >
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 flex items-center justify-center">
                <Download className="h-12 w-12 text-indigo-400" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">📂 No Downloads Yet</p>
              <p className="text-sm text-gray-500">Download notes while signed in to track them here 📝</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-enhanced rounded-2xl border border-indigo-200 p-6"
            >
              <ul className="space-y-3">
                {myDownloads.map((d, index) => {
                  const n = getNote(d.noteId)
                  return (
                    <motion.li
                      key={`${d.at}-${d.noteId}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-4 w-4 text-indigo-500" />
                        <div>
                          {n ? (
                            <Link className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline" to={`/notes/${n.id}`}>
                              📄 {n.title}
                            </Link>
                          ) : (
                            <span className="text-gray-500">📄 Note {d.noteId}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          📅 {new Date(d.at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          🕐 {new Date(d.at).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  )
}
