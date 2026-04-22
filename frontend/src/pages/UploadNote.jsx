import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, BookOpen, Tag, Calendar, Award, Settings, CheckCircle, AlertCircle, X, Zap, Star, Target, Clock, User } from 'lucide-react'
import { FileDropzone } from '../components/FileDropzone'
import { BRANCHES, NOTE_TYPES, SEMESTERS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useGamification } from '../context/GamificationContext'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { postNoteUpload } from '../services/noteService'

function detectFileType(file) {
  if (!file) return 'pdf'
  const n = file.name.toLowerCase()
  if (n.endsWith('.docx')) return 'docx'
  if (file.type.startsWith('image/')) return 'image'
  return 'pdf'
}

export function UploadNote() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addNote, checkDuplicateUpload } = useNotes()
  const { showToast } = useToast()
  const { reward } = useGamification()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [semester, setSemester] = useState('3')
  const [branch, setBranch] = useState('CSE')
  const [unit, setUnit] = useState('Unit 1')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [noteType, setNoteType] = useState('full_notes')
  const [difficulty, setDifficulty] = useState('medium')
  const [examFocused, setExamFocused] = useState(false)
  const [importantExam, setImportantExam] = useState(false)
  const [labViva, setLabViva] = useState(false)
  const [handwritten, setHandwritten] = useState(false)
  const [ocrIndexed, setOcrIndexed] = useState(false)
  const [queue, setQueue] = useState([])
  const [progress, setProgress] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onFiles = (f) => {
    setQueue((q) => [...q, f].slice(0, 8))
  }

  const removeAt = (i) => {
    setQueue((q) => q.filter((_, idx) => idx !== i))
  }

  const runUpload = async (e) => {
    e.preventDefault()
    if (!title.trim() || !subject.trim() || !subjectCode.trim()) {
      showToast('Fill title, subject, and subject code.', 'error')
      return
    }
    if (!queue.length) {
      showToast('Add at least one file.', 'error')
      return
    }
    const dup = checkDuplicateUpload({
      title,
      subjectCode,
      userId: user?.id,
      fileName: queue[0]?.name,
    })
    if (dup.duplicate) {
      const ok = window.confirm('Possible duplicate detected. Upload anyway?')
      if (!ok) return
    }

    setSubmitting(true)
    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    try {
      for (let i = 0; i < queue.length; i += 1) {
        const file = queue[i]
        const id = `${i}-${file.name}`
        setProgress((p) => ({ ...p, [id]: 10 }))
        await new Promise((r) => setTimeout(r, 200 + i * 80))
        setProgress((p) => ({ ...p, [id]: 60 }))
        const fileType = detectFileType(file)
        const fileUrl = URL.createObjectURL(file)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('title', `${title.trim()}${queue.length > 1 ? ` (${i + 1}/${queue.length})` : ''}`)
        fd.append('subject', subject.trim())
        fd.append('subjectCode', subjectCode.trim())
        fd.append('semester', semester)
        fd.append('branch', branch)
        fd.append('description', description.trim())
        fd.append('unit', unit)
        fd.append('tags', JSON.stringify(tagList))
        fd.append('noteType', noteType)
        fd.append('difficulty', difficulty)
        fd.append('examFocused', examFocused)
        fd.append('importantExam', importantExam)
        fd.append('labViva', labViva)
        fd.append('handwritten', handwritten)
        fd.append('ocrIndexed', ocrIndexed || fileType === 'image')
        fd.append('fileType', fileType)
        fd.append('pyqBased', ['pyq', 'mid_term', 'end_sem'].includes(noteType))
        
        const response = await postNoteUpload(fd)
        const backendNote = response.data

        setProgress((p) => ({ ...p, [id]: 100 }))
        const created = addNote({
          ...backendNote,
          id: backendNote?._id || backendNote?.id || `local-${Date.now()}`,
          title: backendNote?.title || `${title.trim()}${queue.length > 1 ? ` (${i + 1}/${queue.length})` : ''}`,
          subject: backendNote?.subject || subject.trim(),
          subjectCode: backendNote?.subjectCode || subjectCode.trim(),
          semester: backendNote?.semester || semester,
          branch: backendNote?.branch || branch,
          unit,
          description: backendNote?.description || description.trim(),
          tags: tagList,
          noteType,
          difficulty,
          examFocused,
          importantExam,
          labViva,
          handwritten,
          ocrIndexed: ocrIndexed || fileType === 'image',
          fileType,
          fileUrl: backendNote?.fileUrl || fileUrl,
          userId: user?.id || 'anon',
          userName: user?.name || 'Student',
        })
        reward('upload')
        if (queue.length === 1) navigate(`/notes/${created.id}`)
      }
      showToast(queue.length > 1 ? 'Bulk upload complete.' : 'Published!', 'success')
      if (queue.length > 1) navigate('/dashboard')
      setQueue([])
      setProgress({})
    } catch {
      showToast('Upload failed — try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 mb-6 shadow-2xl">
          <Upload className="h-12 w-12 text-white" />
          <h1 className="font-display text-3xl font-bold text-white">Upload Notes</h1>
          <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          📤 Multi-file queue, duplicate hints, DOCX/PDF/image, rich metadata, OCR flag
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        onSubmit={runUpload} 
        className="glass-enhanced mx-auto max-w-4xl space-y-8 rounded-3xl border border-purple-500/20 p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FileDropzone
            file={queue[queue.length - 1] || null}
            onFileChange={onFiles}
            error=""
          />
        </motion.div>
        
        {queue.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-enhanced rounded-2xl border border-blue-500/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">Upload Queue</h3>
              <div className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white">
                {queue.length} Files
              </div>
            </div>
            <ul className="space-y-3">
              {queue.map((f, i) => (
                <motion.li 
                  key={`${f.name}-${i}`} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="inline-flex items-center justify-center rounded-lg bg-white p-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <span className="font-mono text-sm font-medium text-gray-800">{f.name}</span>
                      <div className="text-xs text-gray-500">
                        📁 {(f.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress[`${i}-${f.name}`] != null ? (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        {progress[`${i}-${f.name}`]}%
                      </div>
                    ) : (
                      <motion.button
                        type="button" 
                        onClick={() => removeAt(i)} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </motion.button>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid gap-6 sm:grid-cols-2"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="sm:col-span-2"
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Title
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              placeholder="📝 e.g. DBMS Unit 3 — Transactions"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Subject Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              placeholder="📚 Database Management Systems"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-purple-500" />
              Subject Code
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 font-mono text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              placeholder="🏷️ CS302"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Unit / Topic
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              placeholder="📁 Unit 3"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Semester
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  📅 Semester {s}
                </option>
              ))}
            </motion.select>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              Branch
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  🎓 {b}
                </option>
              ))}
            </motion.select>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-500" />
              Category
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              {Object.entries(NOTE_TYPES).map(([k, v]) => (
                <option key={k} value={k}>
                  📋 {v}
                </option>
              ))}
            </motion.select>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              Difficulty
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
            >
              <option value="easy">😊 Easy</option>
              <option value="medium">🎯 Medium</option>
              <option value="advanced">🚀 Advanced</option>
            </motion.select>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="sm:col-span-2"
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-purple-500" />
              Tags (comma separated)
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              rows={2}
              placeholder="🏷️ pyq, revision, sql, algorithms"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="sm:col-span-2"
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-purple-500" />
              Additional Options
            </label>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.label 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-200 hover:border-blue-300 transition-all"
              >
                <input type="checkbox" checked={examFocused} onChange={(e) => setExamFocused(e.target.checked)} className="rounded border-blue-300" />
                <div>
                  <div className="text-sm font-medium text-gray-800">🎯 Exam Focused</div>
                  <div className="text-xs text-gray-600">Important for exams</div>
                </div>
              </motion.label>
              
              <motion.label 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-3 border border-orange-200 hover:border-orange-300 transition-all"
              >
                <input type="checkbox" checked={importantExam} onChange={(e) => setImportantExam(e.target.checked)} className="rounded border-orange-300" />
                <div>
                  <div className="text-sm font-medium text-gray-800">⭐ Important Exam</div>
                  <div className="text-xs text-gray-600">High priority material</div>
                </div>
              </motion.label>
              
              <motion.label 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-green-50 to-teal-50 p-3 border border-green-200 hover:border-green-300 transition-all"
              >
                <input type="checkbox" checked={labViva} onChange={(e) => setLabViva(e.target.checked)} className="rounded border-green-300" />
                <div>
                  <div className="text-sm font-medium text-gray-800">🔬 Lab / Viva</div>
                  <div className="text-xs text-gray-600">Practical content</div>
                </div>
              </motion.label>
              
              <motion.label 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.9 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 p-3 border border-cyan-200 hover:border-cyan-300 transition-all"
              >
                <input type="checkbox" checked={handwritten} onChange={(e) => setHandwritten(e.target.checked)} className="rounded border-cyan-300" />
                <div>
                  <div className="text-sm font-medium text-gray-800">✍️ Handwritten</div>
                  <div className="text-xs text-gray-600">Scan or handwritten</div>
                </div>
              </motion.label>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="sm:col-span-2"
          >
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus-ring w-full rounded-2xl border-2 border-purple-200 bg-white/95 px-4 py-3 text-sm font-medium text-gray-900 transition-all hover:border-purple-300 focus:border-purple-500"
              rows={4}
              placeholder="📝 Describe your notes, topics covered, and any special features..."
            />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-purple-200 pt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/browse" 
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <X className="h-4 w-4" />
              Cancel
            </Link>
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Publish Queue</span>
                <Zap className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  )
}
