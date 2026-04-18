import { useEffect, useRef } from 'react'

export function SearchField({ value, onChange, placeholder = 'Search title, subject, or code…' }) {
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
        ⌕
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-2xl border border-gray-300/50 bg-surface-1/90 py-3.5 pl-11 pr-16 text-sm text-gray-900 placeholder:text-gray-400 shadow-inner"
        autoComplete="off"
        aria-label="Search notes"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-gray-300 bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
        /
      </kbd>
    </div>
  )
}
