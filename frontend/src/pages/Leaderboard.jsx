import { useGamification } from '../context/GamificationContext'
import { motion } from 'framer-motion'
import { Trophy, Medal, Target, TrendingUp, Users, Award, Star, Crown, Zap } from 'lucide-react'

export function Leaderboard() {
  const { leaderboard, badgeMeta } = useGamification()

  return (
    <div className="space-y-12">
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 mb-6 shadow-2xl">
          <Trophy className="h-12 w-12 text-white" />
          <h1 className="font-display text-3xl font-bold text-white">Leaderboard</h1>
          <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          🏆 Points from uploads, votes, comments, and helpful marks — merged with demo seed users
        </p>
        <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-3 border border-yellow-200">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">{leaderboard.length} Competitors</span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">Top Performers</span>
          </div>
        </div>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-enhanced rounded-3xl border border-yellow-500/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-yellow-500/30 bg-gradient-to-r from-yellow-50 to-orange-50">
              <tr>
                <th className="p-4 text-left font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span>Rank</span>
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-600" />
                    <span>Student</span>
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Points</span>
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span>Uploads</span>
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span>Badges</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, index) => (
                <motion.tr 
                  key={row.userId} 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={row.isYou ? 'bg-gradient-to-r from-yellow-100 to-orange-50 border-l-4 border-yellow-400' : 'hover:bg-gray-50'}
                >
                  <td className="p-4">
                    <div className="inline-flex items-center justify-center rounded-lg bg-white p-2">
                      {row.isYou ? (
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="font-mono font-bold text-yellow-600">#{index + 1}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-gray-600">#{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {row.isYou && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span className={`font-medium ${row.isYou ? 'text-gray-900 font-bold' : 'text-gray-800'}`}>
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 text-white font-bold">
                      <Star className="h-3 w-3" />
                      <span>{row.points}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-white font-bold">
                      <Target className="h-3 w-3" />
                      <span>{row.uploads}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(row.badges || []).map((b) => (
                        <div 
                          key={b} 
                          title={badgeMeta[b]?.label} 
                          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 px-2 py-1 text-white text-xs font-bold"
                        >
                          <span>{badgeMeta[b]?.icon}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
