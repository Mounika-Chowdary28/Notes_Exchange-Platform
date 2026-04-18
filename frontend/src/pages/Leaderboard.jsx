import { useGamification } from '../context/GamificationContext'

export function Leaderboard() {
  const { leaderboard, badgeMeta } = useGamification()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-50">Leaderboard & gamification</h1>
        <p className="mt-2 text-muted">Points from uploads, votes, comments, and helpful marks — merged with demo seed users.</p>
      </header>
      <div className="glass overflow-hidden rounded-2xl border border-gold/25">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-600/30 text-muted">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Student</th>
              <th className="p-3">Points</th>
              <th className="p-3">Uploads</th>
              <th className="p-3">Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr key={row.userId} className={row.isYou ? 'bg-accent/10' : ''}>
                <td className="p-3 font-mono text-muted">{i + 1}</td>
                <td className="p-3 font-medium text-gray-900">{row.name}</td>
                <td className="p-3 font-mono text-accent-2">{row.points}</td>
                <td className="p-3">{row.uploads}</td>
                <td className="p-3 text-xs">
                  {(row.badges || []).map((b) => (
                    <span key={b} title={badgeMeta[b]?.label} className="mr-1">
                      {badgeMeta[b]?.icon}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
