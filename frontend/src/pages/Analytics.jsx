import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Award, Download, Eye, Star, Target, Calendar, Clock, Zap, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'

export function Analytics() {
  const { notes, analytics, downloadLog } = useNotes()

  const topSearched = useMemo(() => {
    const m = {}
    notes.forEach((n) => {
      m[n.subjectCode] = (m[n.subjectCode] || 0) + 1
    })
    return Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [notes])

  const topNote = (id) => notes.find((n) => n.id === id)

  return (
    <div className="space-y-12">
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-green-500 to-teal-500 p-6 mb-6 shadow-2xl">
          <BarChart3 className="h-12 w-12 text-white" />
          <h1 className="font-display text-3xl font-bold text-white">Analytics Dashboard</h1>
          <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          📊 Demo dashboard — aggregates from local activity + seed catalog
        </p>
        <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-green-50 to-teal-50 px-6 py-3 border border-green-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Real-time Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">User Activity</span>
          </div>
        </div>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-enhanced rounded-3xl border border-green-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-500 p-2">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-gray-900">Most Downloaded Today</h2>
          </div>
          <p className="mt-2 font-display text-2xl text-gray-900">
            {analytics.topTodayId ? (
              <Link className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors" to={`/notes/${analytics.topTodayId}`}>
                <Download className="h-5 w-5" />
                {topNote(analytics.topTodayId)?.title || analytics.topTodayId}
                <Eye className="h-4 w-4" />
              </Link>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 px-3 py-1 text-xs font-bold text-green-700">
            <TrendingUp className="h-3 w-3" />
            {analytics.topTodayN} hits today
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-enhanced rounded-3xl border border-blue-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-gray-900">Most Downloaded This Week</h2>
          </div>
          <p className="mt-2 font-display text-2xl text-gray-900">
            {analytics.topWeekId ? (
              <Link className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors" to={`/notes/${analytics.topWeekId}`}>
                <Download className="h-5 w-5" />
                {topNote(analytics.topWeekId)?.title || analytics.topWeekId}
                <Eye className="h-4 w-4" />
              </Link>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Clock className="h-3 w-3" />
            {analytics.topWeekN} hits (7d)
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-enhanced rounded-3xl border border-purple-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-gray-900">Trending Subject</h2>
          </div>
          <p className="mt-2 font-display text-2xl text-purple-600">
            🎯 {analytics.trendingSubject || '—'}
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 text-xs font-bold text-purple-700">
            <Star className="h-3 w-3" />
            By Downloads
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-enhanced rounded-3xl border border-orange-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-display text-lg font-bold text-gray-900">Events Logged</h2>
          </div>
          <p className="mt-2 font-display text-2xl text-gray-900">
            📊 {downloadLog.length}
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 px-3 py-1 text-xs font-bold text-orange-700">
            <Download className="h-3 w-3" />
            Download Events
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-green-500/20 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-teal-500 p-3">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Top Contributors</h2>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 px-3 py-1 text-xs font-bold text-green-700">
            <Trophy className="h-3 w-3" />
            Upload Count
          </div>
        </div>
        <ol className="mt-4 space-y-3">
          {analytics.topContributors.map((c, index) => (
            <motion.li
              key={c.userId}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 hover:border-green-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-white p-2">
                  <span className="font-mono text-sm font-bold text-green-600">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{c.userId}</div>
                  <div className="text-sm text-gray-600">📤 {c.count} uploads</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 px-3 py-1 text-xs font-bold text-white">
                <Award className="h-3 w-3" />
                {c.count}
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-blue-500/20 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Catalog Coverage</h2>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Target className="h-3 w-3" />
            By Subject Code
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {topSearched.map(([code, n], index) => (
            <motion.li
              key={code}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-lg bg-white p-2">
                  <span className="font-mono text-sm font-bold text-blue-600">{code}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Subject Code</div>
                  <div className="text-sm text-gray-600">📚 {n} notes indexed</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-bold text-white">
                <BarChart3 className="h-3 w-3" />
                {n}
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
