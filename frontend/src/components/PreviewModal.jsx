import { useEffect, useState } from 'react'

export function PreviewModal({ open, onClose, note, fileUrl }) {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const isPdf = note?.fileType === 'pdf'
  const isImg = note?.fileType === 'image'
  const canEmbed = typeof fileUrl === 'string' && /^(https?:|blob:)/.test(fileUrl)

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Quick preview"
    >
      <div className="glass relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-600/30">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-600/25 px-4 py-3">
          <h2 className="truncate pr-4 font-display text-lg font-semibold text-slate-100">{note?.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            {(isPdf || isImg) && canEmbed ? (
              <>
                <button
                  type="button"
                  className="rounded-lg border border-slate-600/40 px-2 py-1 text-xs text-slate-200 hover:bg-surface-2"
                  onClick={() => setZoom((z) => Math.max(50, z - 10))}
                >
                  −
                </button>
                <span className="text-xs text-muted">{zoom}%</span>
                <button
                  type="button"
                  className="rounded-lg border border-slate-600/40 px-2 py-1 text-xs text-slate-200 hover:bg-surface-2"
                  onClick={() => setZoom((z) => Math.min(200, z + 10))}
                >
                  +
                </button>
                {isPdf ? (
                  <>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-600/40 px-2 py-1 text-xs text-slate-200 hover:bg-surface-2"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Page −
                    </button>
                    <span className="text-xs text-muted">Page {page}</span>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-600/40 px-2 py-1 text-xs text-slate-200 hover:bg-surface-2"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Page +
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="rounded-lg border border-accent/40 px-2 py-1 text-xs font-semibold text-accent hover:bg-accent/15"
                  onClick={() => {
                    const el = document.getElementById('preview-frame-wrap')
                    if (!el) return
                    if (document.fullscreenElement) void document.exitFullscreen()
                    else void el.requestFullscreen?.()
                  }}
                >
                  Full screen
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-warm/20 px-3 py-1 text-sm font-semibold text-warm hover:bg-warm/30"
            >
              Close
            </button>
          </div>
        </header>
        <div id="preview-frame-wrap" className="min-h-[50vh] flex-1 overflow-auto bg-surface-0/90 p-2">
          {canEmbed && isPdf ? (
            <iframe
              title="Preview"
              src={fileUrl}
              className="preview-zoom h-[72vh] w-full rounded-lg border border-slate-600/30"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            />
          ) : canEmbed && isImg ? (
            <div className="flex justify-center p-4">
              <img
                src={fileUrl}
                alt=""
                className="max-h-[75vh] rounded-lg object-contain shadow-lg"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-muted">
              Preview needs a real <code className="text-accent-2">http(s)</code> or <code className="text-accent-2">blob:</code> URL.
              Thumbnails & page scrubber are simulated in the toolbar for PDF workflow demos.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
