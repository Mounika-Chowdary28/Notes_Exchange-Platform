import { useCallback, useState } from 'react'

const accept =
  'application/pdf,image/png,image/jpeg,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.png,.jpg,.jpeg,.webp,.docx'

export function FileDropzone({ file, onFileChange, error }) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDrag(false)
      const f = e.dataTransfer?.files?.[0]
      if (f) onFileChange(f)
    },
    [onFileChange]
  )

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => document.getElementById('file-input')?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            document.getElementById('file-input')?.click()
          }
        }}
        className={`focus-ring cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          drag ? 'border-accent bg-accent/10' : 'border-gray-300 bg-surface-1/60 hover:border-accent/40'
        }`}
        aria-label="Upload file drop zone"
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onFileChange(f)
          }}
        />
        <p className="font-medium text-gray-800">Drop PDF, DOCX, or image here</p>
        <p className="mt-2 text-sm text-muted">or click to browse · max ~12MB per file (demo)</p>
        {file ? (
          <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-accent">{file.name}</p>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  )
}
