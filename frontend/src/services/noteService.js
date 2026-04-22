import { api, hasBackend } from '../lib/api'
import { cloneNotes } from '../data/mockData'

function delay(ms = 280) {
  return new Promise((r) => setTimeout(r, ms))
}

/** @typedef {{ page?: number, limit?: number, subject?: string, quality?: string, sort?: string, search?: string }} NoteQuery */

/**
 * @param {NoteQuery} query
 */
export async function fetchNotesList(query = {}) {
  if (hasBackend) {
    try {
      const { data } = await api.get('/notes', { params: query })
      // Backend returns { success: true, data: notesArray }
      // We wrap it in the expected pagination object for consistency
      const notes = data.success ? data.data : []
      return { 
        notes, 
        pagination: { page: 1, limit: notes.length, total: notes.length, pages: 1 } 
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      return { notes: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } }
    }
  }
  await delay()
  let list = cloneNotes()
  const { subject, quality, search } = query
  if (subject) {
    list = list.filter((n) => n.subject.toLowerCase().includes(subject.toLowerCase()))
  }
  if (quality) {
    list = list.filter((n) => n.quality >= parseInt(quality))
  }
  if (search) {
    const t = search.trim().toLowerCase()
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(t) ||
        n.subject.toLowerCase().includes(t) ||
        (n.description || '').toLowerCase().includes(t)
    )
  }
  list = [...list].sort((a, b) => b.stats.upvotes - a.stats.upvotes)
  return { notes: list, pagination: { page: 1, limit: 10, total: list.length, pages: 1 } }
}

/**
 * @param {string} id
 */
export async function fetchNoteById(id) {
  if (hasBackend) {
    try {
      const { data } = await api.get(`/notes/${id}`)
      if (data.success && data.data) {
        return { ...data.data, id: data.data._id || data.data.id }
      }
      return null
    } catch (error) {
      console.error('Error fetching note:', error)
      return null
    }
  }
  await delay(180)
  const n = cloneNotes().find((x) => x.id === id)
  return n || null
}

/**
 * @param {string} noteId
 * @param {string} voteType - 'upvote' or 'downvote'
 */
export async function voteOnNote(noteId, voteType) {
  if (hasBackend) {
    try {
      const { data } = await api.post(`/notes/${noteId}/vote`, { voteType })
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error voting on note:', error)
      throw error
    }
  }
  await delay(120)
  return { upvotes: 0, downvotes: 0 }
}

/**
 * @param {string} noteId
 */
export async function downloadNote(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.post(`/notes/${noteId}/download`)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error downloading note:', error)
      throw error
    }
  }
  await delay(200)
  return { fileUrl: null }
}

/**
 * @param {string} noteId
 */
export async function verifyNoteApi(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.put(`/notes/${noteId}/verify`)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error verifying note:', error)
      throw error
    }
  }
  return null
}

/**
 * @param {string} noteId
 * @param {object} patch
 */
export async function updateNoteApi(noteId, patch) {
  if (hasBackend) {
    try {
      const { data } = await api.put(`/notes/${noteId}`, patch)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }
  return null
}

/**
 * @param {string} noteId
 */
export async function deleteNoteApi(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.delete(`/notes/${noteId}`)
      return data.success
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }
  return false
}

/**
 * @param {object} noteData
 */
export async function createNote(noteData) {
  if (hasBackend) {
    try {
      const { data } = await api.post('/notes', noteData)
      return { success: data.success, data: data.data, error: null }
    } catch (error) {
      console.error('Error creating note:', error)
      return { success: false, data: null, error: error.response?.data?.message || 'Failed to create note' }
    }
  }
  await delay(400)
  const newNote = {
    id: `local-${Date.now()}`,
    ...noteData,
    stats: { views: 0, downloads: 0, upvotes: 0, downvotes: 0 },
    createdAt: new Date(),
  }
  return { success: true, data: newNote, error: null }
}

/**
 * @param {string} noteId
 * @param {object} updateData
 */
export async function updateNote(noteId, updateData) {
  if (hasBackend) {
    try {
      const { data } = await api.put(`/notes/${noteId}`, updateData)
      return { success: data.success, data: data.data, error: null }
    } catch (error) {
      console.error('Error updating note:', error)
      return { success: false, data: null, error: error.response?.data?.message || 'Failed to update note' }
    }
  }
  await delay(300)
  return { success: true, data: null, error: null }
}

/**
 * @param {string} noteId
 */
export async function deleteNote(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.delete(`/notes/${noteId}`)
      return { success: data.success, error: null }
    } catch (error) {
      console.error('Error deleting note:', error)
      return { success: false, error: error.response?.data?.message || 'Failed to delete note' }
    }
  }
  await delay(200)
  return { success: true, error: null }
}

/**
 * @param {string} search
 */
export async function searchNotes(search) {
  if (hasBackend) {
    try {
      // The backend uses the base /notes route with a 'search' query param
      const { data } = await api.get('/notes', { params: { search } })
      const notes = data.success ? data.data : []
      return { 
        notes, 
        pagination: { page: 1, limit: notes.length, total: notes.length, pages: 1 } 
      }
    } catch (error) {
      console.error('Error searching notes:', error)
      return { notes: [], pagination: {} }
    }
  }
  await delay(300)
  return fetchNotesList({ search })
}

/**
 * Get trending notes
 */
export async function getTrendingNotes() {
  if (hasBackend) {
    try {
      // Since there's no specific /trending route in backend, 
      // we'll use the main list which is already sorted by date or popularity
      const { data } = await api.get('/notes')
      return data.success ? data.data.slice(0, 10) : []
    } catch (error) {
      console.error('Error fetching trending notes:', error)
      return []
    }
  }
  await delay(400)
  const list = cloneNotes()
  return list.sort((a, b) => b.stats.views - a.stats.views).slice(0, 10)
}

/**
 * @param {FormData} formData
 */
export async function postNoteUpload(formData) {
  if (hasBackend) {
    try {
      const { data } = await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return { success: data.success, data: data.data, error: null }
    } catch (error) {
      console.error('Error uploading note:', error)
      return { success: false, data: null, error: error.response?.data?.message || 'Failed to upload note' }
    }
  }
  return { success: true, data: null, error: null }
}

/**
 * @param {string} noteId
 */
export async function fetchComments(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.get(`/notes/${noteId}/comments`)
      return data.success ? data.data : []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }
  return []
}

/**
 * @param {string} noteId
 * @param {string} body
 * @param {string} [parentId]
 */
export async function postComment(noteId, body, parentId = null) {
  if (hasBackend) {
    try {
      const { data } = await api.post(`/notes/${noteId}/comments`, { body, parentId })
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error posting comment:', error)
      throw error
    }
  }
  return null
}

/**
 * @param {string} commentId
 */
export async function markCommentHelpful(commentId) {
  if (hasBackend) {
    try {
      const { data } = await api.put(`/notes/comments/${commentId}/helpful`)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error marking comment helpful:', error)
      throw error
    }
  }
  return null
}

/**
 * @param {string} commentId
 */
export async function setCommentBestAnswer(commentId) {
  if (hasBackend) {
    try {
      const { data } = await api.put(`/notes/comments/${commentId}/best`)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error setting best answer:', error)
      throw error
    }
  }
  return null
}

/**
 * @param {string} noteId
 */
export async function toggleBookmarkApi(noteId) {
  if (hasBackend) {
    try {
      const { data } = await api.post(`/notes/${noteId}/bookmark`)
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      throw error
    }
  }
  return null
}

/**
 * Get user bookmarks
 */
export async function fetchUserBookmarks() {
  if (hasBackend) {
    try {
      const { data } = await api.get('/notes/bookmarks')
      return data.success ? data.data : []
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      return []
    }
  }
  return []
}

/**
 * @param {string} noteId
 * @param {string} reason
 * @param {string} details
 */
export async function postReport(noteId, reason, details) {
  if (hasBackend) {
    try {
      const { data } = await api.post(`/notes/${noteId}/report`, { reason, details })
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error reporting note:', error)
      throw error
    }
  }
  return null
}

/**
 * Get all reports
 */
export async function fetchReportsApi() {
  if (hasBackend) {
    try {
      const { data } = await api.get('/notes/reports')
      return data.success ? data.data : []
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }
  return []
}

export async function fetchStatsApi() {
  if (hasBackend) {
    try {
      const { data } = await api.get('/notes/stats')
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }
  return null
}

/**
 * Reward user
 */
export async function rewardUserApi(kind) {
  if (hasBackend) {
    try {
      const { data } = await api.post('/users/reward', { kind })
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error rewarding user:', error)
      return null
    }
  }
  return null
}

/**
 * Get leaderboard
 */
export async function fetchLeaderboard() {
  if (hasBackend) {
    try {
      const { data } = await api.get('/users/leaderboard')
      return data.success ? data.data : []
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }
  return []
}

/**
 * Get user profile
 */
export async function fetchUserProfile() {
  if (hasBackend) {
    try {
      const { data } = await api.get('/users/profile')
      return data.success ? data.data : null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }
  return null
}
