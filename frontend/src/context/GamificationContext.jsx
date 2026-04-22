import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BADGE_META, MOCK_LEADERBOARD } from '../data/mockData'
import { useAuth } from './AuthContext'
import { useNotes } from './NotesContext'
import { hasBackend } from '../lib/api'
import { rewardUserApi, fetchLeaderboard, fetchUserProfile } from '../services/noteService'

const K_POINTS = 'nex_points'

function readPoints(userId) {
  if (!userId) return 0
  try {
    const raw = localStorage.getItem(`${K_POINTS}_${userId}`)
    return raw ? Number(raw) || 0 : 0
  } catch {
    return 0
  }
}

function writePoints(userId, value) {
  if (!userId) return
  localStorage.setItem(`${K_POINTS}_${userId}`, String(Math.max(0, value)))
}

const GamificationContext = createContext(null)

export function GamificationProvider({ children }) {
  const { user } = useAuth()
  const { notes } = useNotes()
  const uid = user?.id || user?._id
  const [storedPoints, setStoredPoints] = useState(() => readPoints(uid))
  const [backendLeaderboard, setBackendLeaderboard] = useState([])

  useEffect(() => {
    if (hasBackend && uid) {
      const loadProfile = async () => {
        const profile = await fetchUserProfile()
        if (profile) {
          setStoredPoints(profile.points || 0)
        }
      }
      loadProfile()
    } else {
      setStoredPoints(readPoints(uid))
    }
  }, [uid])

  useEffect(() => {
    if (hasBackend) {
      const loadLeaderboard = async () => {
        const data = await fetchLeaderboard()
        setBackendLeaderboard(data)
      }
      loadLeaderboard()
    }
  }, [])

  const reward = useCallback(
    async (kind) => {
      if (!uid) return
      
      if (hasBackend) {
        try {
          const nextPoints = await rewardUserApi(kind)
          if (nextPoints !== null) {
            setStoredPoints(nextPoints)
          }
        } catch (error) {
          console.error('Failed to reward user on backend:', error)
        }
      } else {
        const map = { upload: 50, vote: 2, comment: 8, download: 1, helpful: 15 }
        const pts = map[kind] ?? 0
        if (!pts) return
        const next = readPoints(uid) + pts
        writePoints(uid, next)
        setStoredPoints(next)
      }
    },
    [uid]
  )

  const uploadsByMe = useMemo(() => {
    if (!uid) return 0
    return notes.filter((n) => (n.uploadedBy?.id || n.uploadedBy?._id || n.uploadedBy) === uid).length
  }, [notes, uid])

  const badges = useMemo(() => {
    const b = new Set()
    if (uploadsByMe >= 1) b.add('first_upload')
    if (uploadsByMe >= 10) b.add('top_contributor')
    if (storedPoints >= 1200) b.add('elite_contributor')
    if (storedPoints >= 800 && uploadsByMe >= 5) b.add('semester_hero')
    if (uploadsByMe >= 3 && notes.some((n) => (n.uploadedBy?.id || n.uploadedBy?._id || n.uploadedBy) === uid && n.trending)) b.add('trending_uploader')
    if (user?.role === 'admin') b.add('verified_faculty')
    return [...b]
  }, [uploadsByMe, storedPoints, notes, uid, user?.role])

  const reputation = useMemo(() => Math.round(storedPoints + uploadsByMe * 40), [storedPoints, uploadsByMe])

  const leaderboard = useMemo(() => {
    if (hasBackend && backendLeaderboard.length > 0) {
      return backendLeaderboard.map(u => ({
        userId: u._id,
        name: u.name,
        points: u.points,
        badges: u.badges || [],
        isYou: u._id === uid
      }))
    }
    
    const rows = MOCK_LEADERBOARD.map((r) => ({ ...r, isYou: false }))
    if (user?.name && uid) {
      rows.push({
        userId: uid,
        name: `${user.name} (you)`,
        points: reputation,
        uploads: uploadsByMe,
        badges,
        isYou: true,
      })
    }
    return rows.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 12)
  }, [user?.name, uid, reputation, uploadsByMe, badges, backendLeaderboard])

  const value = useMemo(
    () => ({
      points: reputation,
      rawPoints: storedPoints,
      uploadsByMe,
      badges,
      badgeMeta: BADGE_META,
      leaderboard,
      reward,
    }),
    [reputation, storedPoints, uploadsByMe, badges, leaderboard, reward]
  )

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for provider
export function useGamification() {
  const ctx = useContext(GamificationContext)
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider')
  return ctx
}
