import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, FileText, Star, TrendingUp, Calendar, Tag, Award, Settings, ChevronDown, ChevronUp, Share2, Copy } from 'lucide-react'
import { NoteCard } from '../components/NoteCard'
import { SearchField } from '../components/SearchField'
import { BRANCHES, NOTE_TYPES, SEMESTERS } from '../data/mockData.js'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { filterAndSortNotes } from '../utils/noteFilters'

export function BrowseNotes() {
  const { notes, score } = useNotes()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [subjectCode, setSubjectCode] = useState(searchParams.get('code') || '')
  const [subjectName, setSubjectName] = useState(searchParams.get('subj') || '')
  const [tags, setTags] = useState(searchParams.get('tags') || '')
  const [semester, setSemester] = useState(searchParams.get('sem') || '')
  const [branch, setBranch] = useState(searchParams.get('branch') || '')
  const [unit, setUnit] = useState(searchParams.get('unit') || '')
  const [fileType, setFileType] = useState(searchParams.get('ft') || '')
  const [noteType, setNoteType] = useState(searchParams.get('nt') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('diff') || '')
  const [source, setSource] = useState(searchParams.get('src') || '')
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('ver') === '1')
  const [examOnly, setExamOnly] = useState(searchParams.get('exam') === '1')
  const [pyqOnly, setPyqOnly] = useState(searchParams.get('pyq') === '1')
  const [sort, setSort] = useState(searchParams.get('sort') || 'top')
  const [advancedOpen, setAdvancedOpen] = useState(true)

  const subjectOptions = useMemo(() => {
    const s = new Set(notes.map((n) => n.subject))
    return [...s].sort()
  }, [notes])

  const filtered = useMemo(
    () => {
      const result = filterAndSortNotes(notes, {
        q,
        subjectCode,
        subject: subjectName,
        tags,
        semester,
        branch,
        unit,
        fileType,
        noteType,
        difficulty,
        source,
        verifiedOnly,
        examOnly,
        pyqOnly,
        sort,
      }, score);
      console.log('BrowseNotes Debug:', { 
        totalNotes: notes.length, 
        filteredCount: result.length, 
        filters: { q, subjectCode, subjectName, semester, branch, sort }
      });
      return result;
    },
    [
      notes,
      q,
      subjectCode,
      subjectName,
      tags,
      semester,
      branch,
      unit,
      fileType,
      noteType,
      difficulty,
      source,
      verifiedOnly,
      examOnly,
      pyqOnly,
      sort,
      score,
    ]
  )

  const buildParams = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (subjectCode) p.set('code', subjectCode)
    if (subjectName) p.set('subj', subjectName)
    if (tags) p.set('tags', tags)
    if (semester) p.set('sem', semester)
    if (branch) p.set('branch', branch)
    if (unit) p.set('unit', unit)
    if (fileType) p.set('ft', fileType)
    if (noteType) p.set('nt', noteType)
    if (difficulty) p.set('diff', difficulty)
    if (source) p.set('src', source)
    if (verifiedOnly) p.set('ver', '1')
    if (examOnly) p.set('exam', '1')
    if (pyqOnly) p.set('pyq', '1')
    if (sort && sort !== 'top') p.set('sort', sort)
    return p
  }

  const copyShareLink = async () => {
    const p = buildParams()
    setSearchParams(p, { replace: true })
    const qs = p.toString()
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ''}`
    try {
      await navigator.clipboard.writeText(url)
      showToast('Advanced search link copied.', 'success')
    } catch {
      showToast('Clipboard blocked.', 'error')
    }
  }

  return (
    <div className="space-y-12">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600">
            <BookOpen className="h-4 w-4" />
            <span>Academic Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Find your <span className="text-emerald-500">study material.</span>
          </h1>
          <p className="text-lg font-medium text-slate-600">
            Access thousands of verified notes, previous year papers, and unit-wise study guides shared by your peers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={copyShareLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 px-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all"
          >
            <Share2 className="h-4 w-4" />
            Share Search
          </motion.button>
          
          <motion.button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all"
          >
            {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            {advancedOpen ? 'Hide Filters' : 'Show Filters'}
          </motion.button>
        </div>
      </motion.header>

      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -z-10" />
        <SearchField value={q} onChange={setQ} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {advancedOpen && (
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 shrink-0 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm sticky top-28"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Filters</h2>
              <button 
                onClick={() => {
                  setSemester(''); setBranch(''); setNoteType(''); setFileType('');
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Reset All
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Semester</label>
                <div className="grid grid-cols-4 gap-2">
                  {SEMESTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSemester(semester === s ? '' : s)}
                      className={`h-10 rounded-lg text-xs font-black transition-all ${
                        Number(semester) === Number(s) 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Content Type</label>
                <div className="space-y-2">
                  {Object.entries(NOTE_TYPES).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNoteType(noteType === key ? '' : key)}
                      className={`w-full h-11 px-4 rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between ${
                        noteType === key 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                      {noteType === key && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Verified Only</span>
                  <button 
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`w-12 h-6 rounded-full transition-all relative ${verifiedOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${verifiedOnly ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500">
              Showing <span className="text-slate-900">{filtered.length}</span> materials
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Sort by:</span>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="text-sm font-black text-emerald-600 bg-transparent cursor-pointer focus:outline-none"
              >
                <option value="top">Popularity</option>
                <option value="new">Newest First</option>
                <option value="score">Top Rated</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200">
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
