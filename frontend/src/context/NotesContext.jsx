import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cloneNotes } from '../data/mockData'
import { hasBackend } from '../lib/api'
import { useAuth } from './AuthContext'
import { voteOnNote, fetchNotesList, fetchNoteById, fetchComments, postComment, markCommentHelpful as markHelpfulApi, setCommentBestAnswer as setBestAnswerApi, toggleBookmarkApi, fetchUserBookmarks, postReport, verifyNoteApi, updateNoteApi, deleteNoteApi, fetchReportsApi, fetchStatsApi } from '../services/noteService'

const NotesContext = createContext(null)

const K_VOTES = 'nex_votes'
const K_BOOKMARKS = 'nex_bookmarks'
const K_CUSTOM = 'nex_custom_notes'
const K_COMMENTS = 'nex_extra_comments'
const K_DELETED = 'nex_deleted_ids'
const K_PATCHES = 'nex_note_patches'
const K_VIEWS = 'nex_view_extra'
const K_BBOOST = 'nex_bookmark_boost'
const K_COLLECTIONS = 'nex_collections'
const K_REPORTS = 'nex_reports'
const K_DOWNLOADS = 'nex_download_log'
const K_RECENT = 'nex_recent_views'

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function mergeBase() {
  const base = cloneNotes()
  const custom = loadJson(K_CUSTOM, [])
  return [...base, ...custom]
}

export function NotesProvider({ children }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState(() => mergeBase())
  const [loading, setLoading] = useState(false)

  const [userVotes, setUserVotes] = useState(() => loadJson(K_VOTES, {}))

  // Clear local votes when user logs out
  useEffect(() => {
    if (!user) {
      setUserVotes({})
      localStorage.removeItem(K_VOTES)
    }
  }, [user])
  const [bookmarks, setBookmarks] = useState(() => new Set(loadJson(K_BOOKMARKS, [])))
  const [extraComments, setExtraComments] = useState(() => loadJson(K_COMMENTS, {}))
  const [deletedIds, setDeletedIds] = useState(() => new Set(loadJson(K_DELETED, [])))
  const [patches, setPatches] = useState(() => loadJson(K_PATCHES, {}))
  const [viewExtra, setViewExtra] = useState(() => loadJson(K_VIEWS, {}))
  const [bookmarkBoost, setBookmarkBoost] = useState(() => loadJson(K_BBOOST, {}))
  const [collections, setCollections] = useState(() => loadJson(K_COLLECTIONS, []))
  const [reports, setReports] = useState(() => loadJson(K_REPORTS, []))
  const [analytics, setAnalytics] = useState(null)

  const loadReports = useCallback(async () => {
    if (hasBackend) {
      try {
        const data = await fetchReportsApi()
        setReports(data.map(r => ({
          ...r,
          id: r._id || r.id,
          noteId: r.noteId?._id || r.noteId?.id || r.noteId,
          noteTitle: r.noteId?.title || 'Unknown Note'
        })))
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      }
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    if (hasBackend) {
      try {
        const data = await fetchStatsApi()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }
  }, [])

  const loadAllNotes = useCallback(async (isSilent = false) => {
    if (hasBackend) {
      if (!isSilent) setLoading(true)
      try {
        const [notesData, bookmarkedData] = await Promise.all([
          fetchNotesList(),
          fetchUserBookmarks()
        ])
        // Standardize notes extraction
        const backendNotes = (notesData?.notes || []).map(n => ({
          ...n,
          id: n._id || n.id
        }))
        
        // Merge backend notes with local custom notes
        const custom = loadJson(K_CUSTOM, [])
        setNotes([...backendNotes, ...custom])

        if (bookmarkedData) {
          setBookmarks(new Set(bookmarkedData.map(b => b._id || b.id)))
        }

        // Fetch reports too
        loadReports()
      } catch (error) {
        console.error('Failed to fetch notes from backend:', error)
      } finally {
        if (!isSilent) setLoading(false)
      }
    }
  }, [loadReports])

  useEffect(() => {
    loadAllNotes()
    
    // Dynamic updates: Poll for changes every 15 seconds
    const interval = setInterval(() => {
      loadAllNotes(true) // Silent reload
    }, 15000)
    
    return () => clearInterval(interval)
  }, [loadAllNotes])
  const [downloadLog, setDownloadLog] = useState(() => loadJson(K_DOWNLOADS, []))
  const [recentViews, setRecentViews] = useState(() => loadJson(K_RECENT, []))

  useEffect(() => {
    localStorage.setItem(K_VOTES, JSON.stringify(userVotes))
  }, [userVotes])
  useEffect(() => {
    localStorage.setItem(K_BOOKMARKS, JSON.stringify([...bookmarks]))
  }, [bookmarks])
  useEffect(() => {
    localStorage.setItem(K_COMMENTS, JSON.stringify(extraComments))
  }, [extraComments])
  useEffect(() => {
    localStorage.setItem(K_DELETED, JSON.stringify([...deletedIds]))
  }, [deletedIds])
  useEffect(() => {
    localStorage.setItem(K_PATCHES, JSON.stringify(patches))
  }, [patches])
  useEffect(() => {
    localStorage.setItem(K_VIEWS, JSON.stringify(viewExtra))
  }, [viewExtra])
  useEffect(() => {
    localStorage.setItem(K_BBOOST, JSON.stringify(bookmarkBoost))
  }, [bookmarkBoost])
  useEffect(() => {
    localStorage.setItem(K_COLLECTIONS, JSON.stringify(collections))
  }, [collections])
  useEffect(() => {
    localStorage.setItem(K_REPORTS, JSON.stringify(reports))
  }, [reports])
  useEffect(() => {
    localStorage.setItem(K_DOWNLOADS, JSON.stringify(downloadLog))
  }, [downloadLog])
  useEffect(() => {
    localStorage.setItem(K_RECENT, JSON.stringify(recentViews))
  }, [recentViews])

  useEffect(() => {
    const custom = notes.filter((n) => String(n.id).startsWith('local-'))
    localStorage.setItem(K_CUSTOM, JSON.stringify(custom))
  }, [notes])

  const resolveNote = useCallback(
    (n) => ({
      ...n,
      ...(patches[n.id] || {}),
      views: (n.stats?.views ?? n.views ?? 0) + (viewExtra[n.id] || 0),
      downloads: (n.stats?.downloads ?? n.downloads ?? 0),
      upvotes: (n.stats?.upvotes ?? n.upvotes ?? 0),
      downvotes: (n.stats?.downvotes ?? n.downvotes ?? 0),
    }),
    [patches, viewExtra]
  )

  const allNotes = useMemo(() => {
    return notes.filter((n) => !deletedIds.has(n.id)).map(resolveNote)
  }, [notes, deletedIds, resolveNote])

  const getNote = useCallback((id) => allNotes.find((n) => n.id === id), [allNotes])

  const getBookmarkCount = useCallback(
    (note) => Math.max(0, (note.bookmarkCountBase ?? 0) + (bookmarkBoost[note.id] || 0)),
    [bookmarkBoost]
  )

  const vote = useCallback(async (noteId, type) => {
    let result = null
    if (hasBackend) {
      try {
        result = await voteOnNote(noteId, type === 'up' ? 'upvote' : 'downvote')
        if (result) {
          setNotes((prev) =>
            prev.map((n) => (n.id === noteId || n._id === noteId ? { ...n, stats: result.stats, userVote: result.userVote } : n))
          )
        }
      } catch (error) {
        console.error('Voting failed:', error)
      }
    }
    
    setUserVotes((prev) => {
      const cur = prev[noteId]
      const next = { ...prev }
      if (cur === type) delete next[noteId]
      else next[noteId] = type
      return next
    })
  }, [])

  const score = useCallback(
    (note) => {
      // Prioritize backend-provided userVote
      let v = note.userVote;
      if (v === 'upvote') v = 'up';
      else if (v === 'downvote') v = 'down';
      
      // Fallback to local state if backend didn't provide it
      if (v === undefined || v === null) {
        v = userVotes[note.id] || userVotes[note._id]
      }

      // If we have backend stats, use them directly
      if (note.stats) {
        const up = note.stats.upvotes || 0
        const down = note.stats.downvotes || 0
        return { up, down, net: up - down, userVote: v ?? null }
      }
      // Fallback for mock/local notes
      const up = (note.upvotes || 0) + (v === 'up' ? 1 : 0)
      const down = (note.downvotes || 0) + (v === 'down' ? 1 : 0)
      return { up, down, net: up - down, userVote: v ?? null }
    },
    [userVotes]
  )

  const toggleBookmark = useCallback(
    async (noteId) => {
      if (hasBackend) {
        try {
          const newCount = await toggleBookmarkApi(noteId)
          if (newCount !== null) {
            setNotes((prev) =>
              prev.map((n) =>
                n.id === noteId || n._id === noteId ? { ...n, bookmarkCountBase: newCount } : n
              )
            )
          }
        } catch (error) {
          console.error('Failed to toggle bookmark on backend:', error)
        }
      }
      setBookmarks((prev) => {
        const n = new Set(prev)
        const had = n.has(noteId)
        if (had) n.delete(noteId)
        else n.add(noteId)
        setBookmarkBoost((b) => {
          const cur = b[noteId] || 0
          const delta = had ? -1 : 1
          const next = { ...b, [noteId]: Math.max(-1000, cur + delta) }
          return next
        })
        return n
      })
    },
    []
  )

  const isBookmarked = useCallback((noteId) => bookmarks.has(noteId), [bookmarks])

  const addNote = useCallback((payload) => {
    const id = `local-${crypto.randomUUID?.() ?? Date.now()}`
    const note = {
      id,
      title: payload.title,
      subject: payload.subject,
      subjectCode: payload.subjectCode.toUpperCase(),
      semester: Number(payload.semester),
      branch: payload.branch,
      unit: payload.unit || 'Unit 1',
      fileType: payload.fileType,
      fileUrl: payload.fileUrl || '#uploaded',
      description: payload.description || '',
      tags: payload.tags || [],
      noteType: payload.noteType || 'full_notes',
      difficulty: payload.difficulty || 'medium',
      source: 'student',
      verifiedFaculty: false,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      downloads: 0,
      reportCount: 0,
      version: 1,
      versionLabel: 'v1',
      versions: [{ v: 1, label: 'v1', at: new Date().toISOString() }],
      ocrIndexed: Boolean(payload.ocrIndexed),
      bookmarkCountBase: 0,
      uploadedBy: { id: payload.userId, name: payload.userName },
      createdAt: new Date().toISOString(),
      comments: [],
      trending: false,
      recommended: false,
      pyqBased: ['pyq', 'mid_term', 'end_sem'].includes(payload.noteType),
      bestForExams: Boolean(payload.examFocused),
      examFocused: Boolean(payload.examFocused),
      importantExam: Boolean(payload.importantExam),
      labViva: Boolean(payload.labViva),
      handwritten: Boolean(payload.handwritten),
    }
    setNotes((prev) => [note, ...prev])
    return note
  }, [])

  const editNote = useCallback(async (id, patch, isLocalId) => {
    if (hasBackend && !isLocalId && !String(id).startsWith('local-')) {
      try {
        await updateNoteApi(id, patch)
      } catch (error) {
        console.error('Failed to update note on backend:', error)
      }
    }
    if (isLocalId || String(id).startsWith('local-')) {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
    } else {
      setNotes((prev) => prev.map((n) => (n.id === id || n._id === id ? { ...n, ...patch } : n)))
    }
  }, [])

  const deleteNote = useCallback(async (id) => {
    if (hasBackend && !String(id).startsWith('local-')) {
      try {
        const success = await deleteNoteApi(id)
        if (!success) return
      } catch (error) {
        console.error('Failed to delete note on backend:', error)
        return
      }
    }
    setNotes((prev) => prev.filter((n) => n.id !== id && n._id !== id))
  }, [])

  const verifyNote = useCallback(async (noteId) => {
    if (hasBackend) {
      try {
        await verifyNoteApi(noteId)
      } catch (error) {
        console.error('Failed to verify note on backend:', error)
      }
    }
    setNotes((prev) => prev.map((n) => (n.id === noteId || n._id === noteId ? { ...n, verifiedFaculty: true } : n)))
  }, [])

  const loadComments = useCallback(async (noteId) => {
    if (hasBackend) {
      try {
        const data = await fetchComments(noteId)
        setExtraComments((prev) => ({ ...prev, [noteId]: data }))
      } catch (error) {
        console.error('Failed to load comments:', error)
      }
    }
  }, [])

  const recordView = useCallback(async (noteId) => {
    if (hasBackend) {
      try {
        await fetchNoteById(noteId) // This backend route increments view count
        loadComments(noteId) // Also load comments when viewing
      } catch (error) {
        console.error('Failed to record view:', error)
      }
    }
    setViewExtra((v) => ({ ...v, [noteId]: (v[noteId] || 0) + 1 }))
    setRecentViews((r) => {
      const next = [noteId, ...r.filter((x) => x !== noteId)]
      return next.slice(0, 30)
    })
  }, [loadComments])

  const bumpDownload = useCallback(async (noteId, userId) => {
    if (hasBackend) {
      try {
        await downloadNote(noteId)
      } catch (error) {
        console.error('Failed to bump download:', error)
      }
    }
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId || n._id === noteId ? { ...n, downloads: (n.downloads || 0) + 1 } : n))
    )
    setDownloadLog((log) => [{ at: new Date().toISOString(), noteId, userId: userId || null }, ...log].slice(0, 500))
  }, [])

  const addComment = useCallback(async (noteId, authorName, body, parentId = null, seedComments = []) => {
    if (hasBackend) {
      try {
        const newComment = await postComment(noteId, body, parentId)
        if (newComment) {
          setExtraComments((prev) => {
            const list = prev[noteId] || []
            return { ...prev, [noteId]: [...list, { ...newComment, id: newComment._id || newComment.id }] }
          })
        }
        return
      } catch (error) {
        console.error('Failed to add comment to backend:', error)
      }
    }

    const c = {
      id: `lc-${crypto.randomUUID?.() ?? Date.now()}`,
      authorName,
      body,
      createdAt: new Date().toISOString(),
      replies: [],
      helpful: 0,
      bestAnswer: false,
    }
    setExtraComments((prev) => {
      const list = prev[noteId] || []
      if (!parentId) {
        return { ...prev, [noteId]: [...list, c] }
      }
      const inExtra = list.some((x) => x.id === parentId)
      const inSeed = seedComments.some((x) => x.id === parentId)
      if (!inExtra && inSeed) {
        const parent = seedComments.find((x) => x.id === parentId)
        const bridge = {
          ...parent,
          replies: [...(parent.replies || []), { ...c, id: `lr-${c.id}` }],
        }
        return { ...prev, [noteId]: [...list, bridge] }
      }
      const mapped = list.map((x) => {
        if (x.id !== parentId) return x
        return { ...x, replies: [...(x.replies || []), { ...c, id: `lr-${c.id}` }] }
      })
      return { ...prev, [noteId]: mapped }
    })
  }, [])

  const markCommentHelpful = useCallback(async (noteId, commentId) => {
    if (hasBackend) {
      try {
        await markHelpfulApi(commentId)
      } catch (error) {
        console.error('Failed to mark helpful on backend:', error)
      }
    }
    setExtraComments((prev) => {
      const list = prev[noteId] || []
      const bump = (arr) =>
        arr.map((x) => {
          if (x.id === commentId) return { ...x, helpful: (x.helpful || 0) + 1 }
          if (x.replies?.length) return { ...x, replies: bump(x.replies) }
          return x
        })
      return { ...prev, [noteId]: bump(list) }
    })
  }, [])

  const setBestAnswer = useCallback(async (noteId, commentId) => {
    if (hasBackend) {
      try {
        await setBestAnswerApi(commentId)
      } catch (error) {
        console.error('Failed to set best answer on backend:', error)
      }
    }
    setExtraComments((prev) => {
      const list = (prev[noteId] || []).map((x) => ({
        ...x,
        bestAnswer: x.id === commentId,
      }))
      return { ...prev, [noteId]: list }
    })
  }, [])

  const commentsFor = useCallback(
    (note) => {
      const base = (note.comments || []).map((c) => ({ ...c, replies: c.replies || [] }))
      const extra = extraComments[note.id] || []
      const out = [...base]
      extra.forEach((e) => {
        const i = out.findIndex((b) => b.id === e.id)
        if (i >= 0) {
          out[i] = {
            ...out[i],
            ...e,
            replies: [...(out[i].replies || []), ...(e.replies || [])],
          }
        } else {
          out.push({ ...e, replies: e.replies || [] })
        }
      })
      return out
    },
    [extraComments]
  )

  const submitReport = useCallback(async (payload) => {
    if (hasBackend) {
      try {
        await postReport(payload.noteId, payload)
      } catch (error) {
        console.error('Failed to submit report to backend:', error)
      }
    }
    const row = {
      id: `rep-${crypto.randomUUID?.() ?? Date.now()}`,
      ...payload,
      at: new Date().toISOString(),
    }
    setReports((r) => [row, ...r])
    const noteId = payload.noteId
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId || n._id === noteId ? { ...n, reportCount: (n.reportCount || 0) + 1 } : n))
    )
  }, [])

  const addCollection = useCallback((name) => {
    const col = {
      id: `col-${crypto.randomUUID?.() ?? Date.now()}`,
      name: name.trim() || 'New collection',
      noteIds: [],
      createdAt: new Date().toISOString(),
    }
    setCollections((c) => [...c, col])
    return col
  }, [])

  const toggleNoteInCollection = useCallback((collectionId, noteId) => {
    setCollections((cols) =>
      cols.map((c) => {
        if (c.id !== collectionId) return c
        const has = c.noteIds.includes(noteId)
        return {
          ...c,
          noteIds: has ? c.noteIds.filter((x) => x !== noteId) : [...c.noteIds, noteId],
        }
      })
    )
  }, [])

  const checkDuplicateUpload = useCallback(
    (hint) => {
      const { title, subjectCode, userId, fileName } = hint
      const t = title.trim().toLowerCase()
      const hit = allNotes.find(
        (n) =>
          n.uploadedBy?.id === userId &&
          (n.title.toLowerCase() === t ||
            (fileName && n.title.toLowerCase().includes(t.slice(0, 8))) ||
            (subjectCode && n.subjectCode === subjectCode.toUpperCase() && t.length > 5 && n.title === title.trim()))
      )
      return { duplicate: Boolean(hit), note: hit || null }
    },
    [allNotes]
  )

  const derivedAnalytics = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- time window for "today/week" analytics
    const now = Date.now()
    const day = 86400000
    const today = downloadLog.filter((x) => now - new Date(x.at).getTime() < day)
    const week = downloadLog.filter((x) => now - new Date(x.at).getTime() < 7 * day)
    const noteDownloadsToday = {}
    today.forEach((x) => {
      noteDownloadsToday[x.noteId] = (noteDownloadsToday[x.noteId] || 0) + 1
    })
    let topTodayId = null
    let topTodayN = 0
    Object.entries(noteDownloadsToday).forEach(([id, n]) => {
      if (n > topTodayN) {
        topTodayN = n
        topTodayId = id
      }
    })
    const weekCounts = {}
    week.forEach((x) => {
      weekCounts[x.noteId] = (weekCounts[x.noteId] || 0) + 1
    })
    let topWeekId = null
    let topWeekN = 0
    Object.entries(weekCounts).forEach(([id, n]) => {
      if (n > topWeekN) {
        topWeekN = n
        topWeekId = id
      }
    })
    const bySubject = {}
    allNotes.forEach((n) => {
      bySubject[n.subjectCode] = (bySubject[n.subjectCode] || 0) + (n.downloads || 0)
    })
    let trendingSubject = null
    let ts = 0
    Object.entries(bySubject).forEach(([k, v]) => {
      if (v > ts) {
        ts = v
        trendingSubject = k
      }
    })
    const contributorMap = {}
    allNotes.forEach((n) => {
      const uid = n.uploadedBy?.id
      if (!uid) return
      contributorMap[uid] = (contributorMap[uid] || 0) + 1
    })
    const topContributors = Object.entries(contributorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }))
    return {
      topTodayId,
      topTodayN,
      topWeekId,
      topWeekN,
      trendingSubject,
      topContributors,
      totalDownloadsLogged: downloadLog.length,
      activeReports: reports.length,
    }
  }, [downloadLog, allNotes, reports.length])

  const value = useMemo(
    () => ({
      notes: allNotes,
      getNote,
      vote,
      score,
      toggleBookmark,
      isBookmarked,
      bookmarks,
      getBookmarkCount,
      addNote,
      editNote,
      deleteNote,
      verifyNote,
      loadComments,
      addComment,
      markCommentHelpful,
      setBestAnswer,
      commentsFor,
      bumpDownload,
      recordView,
      recentViews,
      downloadLog,
      collections,
      addCollection,
      toggleNoteInCollection,
      reports,
      loadReports,
      analytics,
      loadAnalytics,
      derivedAnalytics,
      submitReport,
      checkDuplicateUpload,
    }),
    [
      allNotes,
      getNote,
      vote,
      score,
      toggleBookmark,
      isBookmarked,
      bookmarks,
      getBookmarkCount,
      addNote,
      editNote,
      deleteNote,
      verifyNote,
      loadComments,
      addComment,
      markCommentHelpful,
      setBestAnswer,
      commentsFor,
      bumpDownload,
      recordView,
      recentViews,
      downloadLog,
      collections,
      addCollection,
      toggleNoteInCollection,
      reports,
      loadReports,
      analytics,
      loadAnalytics,
      derivedAnalytics,
      submitReport,
      checkDuplicateUpload,
    ]
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook for provider
export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
