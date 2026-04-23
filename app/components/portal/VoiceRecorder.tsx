'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { MediaRow } from '../../portal/pages/[pageId]/edit/PageEditor'

const MAX_SECONDS = 60

interface VoiceRecorderProps {
  pageId: string
  userId: string
  existing: MediaRow | null
  onSaved: (row: MediaRow) => void
  onDeleted: () => void
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

const BAR_COUNT = 16

export default function VoiceRecorder({ pageId, userId, existing, onSaved, onDeleted }: VoiceRecorderProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'preview' | 'uploading'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const blobRef = useRef<Blob | null>(null)
  const previewUrl = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      mediaRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
        previewUrl.current = URL.createObjectURL(blob)
        setStatus('preview')
        setElapsed(0)
        if (timerRef.current) clearInterval(timerRef.current)
      }

      recorder.start(100)
      setStatus('recording')
      setElapsed(0)

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1
          if (next >= MAX_SECONDS) stopRecording()
          return next
        })
      }, 1000)
    } catch {
      setError('Microphone access denied. Please allow microphone use in your browser.')
    }
  }

  async function upload() {
    if (!blobRef.current) return
    setStatus('uploading')
    const path = `${userId}/${pageId}/voice/voice.webm`
    const { error: upErr } = await supabase.storage
      .from('page-media')
      .upload(path, blobRef.current, { upsert: true, contentType: 'audio/webm' })
    if (upErr) { setError('Upload failed. Please try again.'); setStatus('preview'); return }

    const { data: { publicUrl } } = supabase.storage.from('page-media').getPublicUrl(path)

    if (existing) {
      await supabase.from('media_files').delete().eq('id', existing.id)
    }

    const { data: row } = await supabase
      .from('media_files')
      .insert({
        page_id: pageId,
        user_id: userId,
        type: 'audio',
        storage_path: path,
        url: publicUrl,
        file_name: 'voice-message.webm',
        file_size: blobRef.current.size,
        mime_type: 'audio/webm',
        sort_order: 99,
      })
      .select()
      .single()

    if (row) {
      onSaved(row as MediaRow)
      setStatus('idle')
      blobRef.current = null
      if (previewUrl.current) { URL.revokeObjectURL(previewUrl.current); previewUrl.current = null }
    } else {
      setError('Save failed. Please try again.')
      setStatus('preview')
    }
  }

  async function handleDelete() {
    if (!existing) return
    await supabase.storage.from('page-media').remove([existing.storage_path])
    await supabase.from('media_files').delete().eq('id', existing.id)
    onDeleted()
  }

  function discard() {
    blobRef.current = null
    if (previewUrl.current) { URL.revokeObjectURL(previewUrl.current); previewUrl.current = null }
    setStatus('idle')
    setElapsed(0)
  }

  function togglePreviewPlay() {
    const audio = audioRef.current
    if (!audio || !previewUrl.current) return
    if (!audio.src) audio.src = previewUrl.current
    playing ? audio.pause() : audio.play()
  }

  const gold = '#c9a96e'
  const border = 'var(--border)'
  const surface = 'var(--surface)'

  if (status === 'idle' && existing) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text)]">Voice message recorded</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {existing.file_size ? `${(existing.file_size / 1024).toFixed(0)} KB` : 'Saved'}
          </p>
        </div>
        <button
          onClick={() => startRecording()}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
        >
          Re-record
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={startRecording}
          className="flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-[var(--border-hover)] hover:border-[var(--gold)]/40 px-4 py-5 transition-colors group"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: `${gold}15` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </span>
          <div className="text-left">
            <p className="text-sm text-[var(--text)]">Record a voice message</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Up to 60 seconds · Uses your microphone</p>
          </div>
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (status === 'recording') {
    const remaining = MAX_SECONDS - elapsed
    return (
      <div
        className="rounded-xl border px-5 py-5 flex flex-col items-center gap-4"
        style={{ border: `1px solid ${gold}30`, background: `${gold}06` }}
      >
        <div className="flex items-center gap-[3px] h-10">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div
              key={i}
              className="rounded-full animate-pulse"
              style={{
                width: 3,
                background: gold,
                height: `${8 + Math.sin(i * 0.8) * 12 + 8}px`,
                opacity: 0.6 + (i % 3) * 0.15,
                animationDelay: `${i * 0.06}s`,
                animationDuration: `${0.5 + (i % 4) * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-mono text-[var(--text)]">{fmt(elapsed)}</span>
          <span className="text-xs text-[var(--text-muted)]">· {remaining}s remaining</span>
        </div>
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium transition-all"
          style={{ background: gold, color: '#030205' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          Stop Recording
        </button>
      </div>
    )
  }

  if (status === 'preview') {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 flex flex-col gap-4">
        <p className="text-xs text-[var(--text-muted)]">Preview your recording</p>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePreviewPlay}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: gold, color: '#030205' }}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 1 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
          <div
            className="flex-1 h-px rounded-full"
            style={{ background: `${gold}25` }}
          />
        </div>
        <audio
          ref={audioRef}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <div className="flex gap-2">
          <button
            onClick={upload}
            className="flex-1 rounded-full py-2 text-xs font-medium transition-all"
            style={{ background: gold, color: '#030205' }}
          >
            Save Voice Message
          </button>
          <button
            onClick={discard}
            className="rounded-full px-4 py-2 text-xs border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            Discard
          </button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-5 flex items-center gap-3">
      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke={gold} strokeWidth="3" />
        <path className="opacity-75" fill={gold} d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="text-sm text-[var(--text-muted)]">Uploading voice message&hellip;</p>
    </div>
  )
}
