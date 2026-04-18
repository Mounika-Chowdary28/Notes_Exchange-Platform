import { useMemo } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="space-y-12">
      <section className="relative -mx-4 -mt-8 min-h-screen overflow-hidden bg-gradient-to-br from-white via-surface-2 to-calm/20 px-6 py-20 sm:px-12 sm:py-24 flex items-center justify-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-calm/10 blur-3xl" />
        <div className="relative w-full max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Student Notes Exchange</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Your <span className="text-gradient">exam-ready</span> knowledge hub.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gray-700">
            Auth, advanced search, PYQ lane, collections, exam prep mode,
            and a green–teal visual system built for standout demos.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/browse"
              className="focus-ring inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              Explore notes
            </Link>
            <Link
              to="/exam-prep"
              className="focus-ring inline-flex items-center justify-center rounded-2xl border-2 border-calm bg-white/80 px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-calm/10"
            >
              Exam prep mode
            </Link>
            <Link
              to="/auth"
              className="focus-ring inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-gray-100"
            >
              Join to upload
            </Link>
          </div>
          <dl className="mt-16 grid grid-cols-3 gap-8 border-t-2 border-gray-300 pt-12 sm:max-w-lg">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">Notes</dt>
              <dd className="mt-2 font-display text-3xl font-bold text-gray-900">{notes.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">Downloads</dt>
              <dd className="mt-2 font-display text-3xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">Branches</dt>
              <dd className="mt-2 font-display text-3xl font-bold text-gray-900">{branches}</dd>
            </div>
          </dl>
        </div>
      </section>

      <TrendingCarousel key={trending.map((n) => n.id).join('|')} items={trending} />

      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Top rated notes</h2>
              <p className="mt-1 text-muted">Highest net votes — great for homepage social proof.</p>
            </div>
            <Link to="/browse?sort=top" className="text-sm font-semibold text-accent hover:underline">
              Open browse →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topRated.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Smart picks for you</h2>
              <p className="mt-1 text-muted">Uses branch, semester, recents, downloads, and trending signals (client-side demo).</p>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-calm hover:underline">
              Set profile →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {rec.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>

        <section>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900">Shipped feature coverage</h2>
            <ul className="mt-6 space-y-3 text-gray-700">
              {[
                'JWT session, roles, remember me, forgot/reset (demo)',
                'Upload queue + progress + duplicate guard',
                'Advanced filters & sort (quality, views, downloads)',
                'Bookmarks + collections',
                'Comments with replies, helpful, best answer',
                'Reports queue + admin verify',
                'OCR flag + simulated search',
                'Roadmap / PYQ / Exam prep surfaces',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-display text-xl font-semibold text-warm">Try these routes</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>
                <Link className="text-calm hover:underline" to="/papers">
                  /papers
                </Link>
                {' '}— PYQ lane
              </li>
              <li>
                <Link className="text-calm hover:underline" to="/browse">
                  /browse
                </Link>
                {' '}— Browse notes
              </li>
              <li>
                <Link className="text-calm hover:underline" to="/exam-prep">
                  /exam-prep
                </Link>
                {' '}— Exam prep mode
              </li>
            </ul>
          </div>
        </div>
        </section>
      </div>
    </div>
  )
}
