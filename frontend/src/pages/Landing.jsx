import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Download, Users, Star, TrendingUp, Sparkles, Zap, Target, Award, FileText, Upload } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { TrendingCarousel } from '../components/TrendingCarousel'
import { useAuth } from '../context/AuthContext'
import { useNotes } from '../context/NotesContext'
import { getSmartRecommendations, topRatedNotes } from '../utils/recommendations'

export function Landing() {
  const { user } = useAuth()
  const { notes, score, recentViews } = useNotes()
  const totalDownloads = notes.reduce((acc, n) => acc + n.downloads, 0)
  const branches = new Set(notes.map((n) => n.branch)).size

  const trending = useMemo(
    () => [...notes].sort((a, b) => score(b).net - score(a).net).slice(0, 5),
    [notes, score]
  )

  const topRated = useMemo(() => topRatedNotes(notes, score, 3), [notes, score])

  const rec = useMemo(() => {
    const recentCodes = recentViews.map((id) => notes.find((n) => n.id === id)?.subjectCode).filter(Boolean)
    return getSmartRecommendations(
      notes,
      { branch: user?.branch, semester: user?.semester },
      recentCodes,
      score
    ).slice(0, 4)
  }, [notes, user?.branch, user?.semester, recentViews, score])

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative -mx-6 -mt-24 min-h-[90vh] overflow-hidden px-6 pt-32 pb-20 flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px] animate-pulse delay-700" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl text-center z-10"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-2xl shadow-slate-900/20"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>The Ultimate Academic Knowledge Hub</span>
            <div className="h-4 w-px bg-slate-700 mx-2" />
            <span className="text-emerald-400">v2.0 is live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Master your exams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">shared wisdom.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-2xl text-xl text-slate-600 mb-12 leading-relaxed font-medium"
          >
            Access high-quality notes, previous year papers, and AI-powered study guides. Built by students, for students.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-5"
          >
            <Link
              to="/browse"
              className="group h-14 px-10 inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-500 text-white text-lg font-bold shadow-xl shadow-emerald-500/25 transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <BookOpen className="h-5 w-5" />
              Start Learning
            </Link>
            <Link
              to="/upload"
              className="h-14 px-10 inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 text-white text-lg font-bold shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              <Upload className="h-5 w-5" />
              Share Notes
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-200/60"
          >
            {[
              { label: 'Verified Notes', value: notes.length, icon: FileText, color: 'text-emerald-500' },
              { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'text-cyan-500' },
              { label: 'Active Branches', value: branches, icon: Target, color: 'text-purple-500' },
              { label: 'Community Rating', value: '4.9/5', icon: Star, color: 'text-amber-500' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`flex justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <TrendingCarousel key={trending.map((n) => n.id).join('|')} items={trending} />

      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-500" />
                Top rated notes
                <Star className="h-6 w-6 text-yellow-400" />
              </h2>
              <p className="mt-2 text-lg text-gray-600">Highest rated content from our community ⭐</p>
            </div>
            <Link to="/browse?sort=top" className="group flex items-center gap-2 text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Browse all
              <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topRated.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <NoteCard note={note} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-500" />
                Smart picks for you
                <Zap className="h-6 w-6 text-yellow-400" />
              </h2>
              <p className="mt-2 text-lg text-gray-600">Personalized recommendations based on your profile 🎯</p>
            </div>
            <Link to="/dashboard" className="group flex items-center gap-2 text-lg font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
              Update profile
              <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {rec.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <NoteCard note={note} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl flex items-center justify-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              Platform Features
              <Award className="h-8 w-8 text-purple-500" />
            </h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need for academic success 🚀</p>
          </div>
          
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-6">🚀 Shipped Features</h3>
              <ul className="space-y-4 text-gray-700">
                {[
                  { icon: '🔐', text: 'JWT authentication with roles & security' },
                  { icon: '📤', text: 'Smart upload queue with progress tracking' },
                  { icon: '🔍', text: 'Advanced filters & intelligent search' },
                  { icon: '📚', text: 'Bookmarks & organized collections' },
                  { icon: '💬', text: 'Comments with replies & best answers' },
                  { icon: '🛡️', text: 'Admin moderation & content verification' },
                  { icon: '📸', text: 'OCR support for scanned documents' },
                  { icon: '🎯', text: 'Exam prep mode & roadmaps' },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 shadow-xl"
            >
              <h3 className="font-display text-2xl font-semibold text-orange-600 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Quick Navigation
                <Sparkles className="h-5 w-5" />
              </h3>
              <ul className="space-y-4">
                {[
                  { to: '/papers', icon: '📄', desc: 'Previous Year Questions', emoji: '🎓' },
                  { to: '/browse', icon: '📚', desc: 'Browse All Notes', emoji: '🔍' },
                  { to: '/exam-prep', icon: '🎯', desc: 'Exam Preparation Mode', emoji: '⚡' },
                  { to: '/collections', icon: '📁', desc: 'Your Collections', emoji: '📂' },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link
                      to={item.to}
                      className="flex items-center justify-between rounded-xl p-4 bg-white/60 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-cyan-50 transition-all duration-300 border border-gray-200 hover:border-emerald-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{item.desc}</div>
                          <div className="text-sm text-gray-600">/{item.to.substring(1)}</div>
                        </div>
                      </div>
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
