'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { savePage, submitForReview, deleteMediaFile, updateMediaOrder, updateGalleryVisibility } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentFields {
  subtitle: string
  story: string
  eventDate: string
  name1: string
  name2: string
  countdownDate: string
  venueName: string
  venueAddress: string
  dresscode: string
  rsvpEnabled: boolean
  rsvpDeadline: string
  accessCode: string
}

interface GiftState {
  enabled: boolean
  phone: string
  note: string
}

export interface MediaRow {
  id: string
  type: 'photo' | 'video' | 'audio'
  url: string
  storage_path: string
  sort_order: number
  file_name: string
  file_size?: number
  mime_type?: string
}

export interface PageEditorProps {
  id: string
  slug: string
  title: string
  status: string
  content: Record<string, unknown>
  settings: Record<string, unknown>
  gift_enabled: boolean
  gift_phone: string | null
  gift_qr_url: string | null
  gift_note: string | null
  page_type: string
  tier_name: string
  media: MediaRow[]
  user_id: string
  show_in_gallery: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INVITATION_TYPES = ['wedding_invitation', 'birthday_invitation', 'ceremony_invitation']
const TWO_NAME_TYPES = ['wedding_celebration', 'wedding_invitation', 'anniversary', 'love_letter', 'gender_reveal']
const PREMIUM_TIERS = ['Premium', 'Luxury']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNameLabels(pageType: string): { name1: string; name2?: string } {
  switch (pageType) {
    case 'wedding_celebration':
    case 'wedding_invitation':
      return { name1: "Bride's Name", name2: "Groom's Name" }
    case 'birthday_wish':
    case 'birthday_invitation':
      return { name1: "Birthday Person's Name" }
    case 'anniversary':
      return { name1: 'Partner 1', name2: 'Partner 2' }
    case 'memorial_tribute':
      return { name1: 'Their Name' }
    case 'love_letter':
      return { name1: 'To', name2: 'From' }
    case 'gender_reveal':
      return { name1: "Parent's Name", name2: "Partner's Name" }
    case 'ceremony_invitation':
      return { name1: 'Host Name' }
    default:
      return { name1: 'Name' }
  }
}

function calcCompletion(
  content: ContentFields,
  pageType: string,
  tierName: string,
  photos: MediaRow[],
): number {
  const checks: boolean[] = [
    content.subtitle.trim().length > 0,
    content.name1.trim().length > 0,
    content.story.trim().length > 0,
    content.eventDate.length > 0,
  ]
  if (TWO_NAME_TYPES.includes(pageType)) checks.push(content.name2.trim().length > 0)
  if (INVITATION_TYPES.includes(pageType)) {
    checks.push(content.venueName.trim().length > 0)
    checks.push(content.venueAddress.trim().length > 0)
  }
  if (PREMIUM_TIERS.includes(tierName)) checks.push(photos.length > 0)
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconSave() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconUpload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

function IconMusic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconGrip() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <circle cx="2.5" cy="2.5" r="1" />
      <circle cx="7.5" cy="2.5" r="1" />
      <circle cx="2.5" cy="7.5" r="1" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  )
}

function IconSpinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

// ─── Small UI Components ──────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-base text-[var(--text)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-3 font-medium">
      {children}
    </p>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-[var(--text-muted)] mb-1.5">{children}</label>
}

function Divider() {
  return <div className="h-px bg-[var(--surface-3)]" />
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-[var(--gold)]' : 'bg-[var(--border-hover)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-150 ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <div>
        <p className="text-sm text-[var(--text)]">{label}</p>
        {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function DropZone({
  onFiles,
  accept,
  multiple = false,
  uploading = false,
  hint,
  sizeLimit,
  children,
}: {
  onFiles: (files: FileList) => void
  accept: string
  multiple?: boolean
  uploading?: boolean
  hint?: string
  sizeLimit?: string
  children?: React.ReactNode
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files)
      }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`border border-dashed rounded-xl p-5 flex flex-col items-center gap-2.5 text-center transition-colors ${
        dragging
          ? 'border-[var(--gold)]/60 bg-[var(--gold)]/5'
          : 'border-[var(--border-hover)] hover:border-[var(--gold)]/30 hover:bg-[var(--surface)]/50'
      } ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => { if (e.target.files?.length) onFiles(e.target.files) }}
      />
      <span className="text-[var(--text-muted)]">
        {uploading ? <IconSpinner /> : <IconUpload />}
      </span>
      {children}
      {hint && <p className="text-xs text-[var(--text-muted)]">{uploading ? 'Uploading...' : hint}</p>}
      {sizeLimit && !uploading && (
        <p className="text-[10px] text-[var(--text-dim)]">Max {sizeLimit}</p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PageEditor(props: PageEditorProps) {
  const isInvitation = INVITATION_TYPES.includes(props.page_type)
  const hasTwoNames = TWO_NAME_TYPES.includes(props.page_type)
  const isPremiumPlus = PREMIUM_TIERS.includes(props.tier_name)
  const isLuxury = props.tier_name === 'Luxury'
  const nameLabels = getNameLabels(props.page_type)

  const c = props.content

  // ── State ──────────────────────────────────────────────────────────────────

  const [title, setTitle] = useState(props.title)
  const [content, setContent] = useState<ContentFields>({
    subtitle: (c.subtitle as string) ?? '',
    story: (c.story as string) ?? '',
    eventDate: (c.eventDate as string) ?? '',
    name1: (c.name1 as string) ?? '',
    name2: (c.name2 as string) ?? '',
    countdownDate: (c.countdownDate as string) ?? '',
    venueName: (c.venueName as string) ?? '',
    venueAddress: (c.venueAddress as string) ?? '',
    dresscode: (c.dresscode as string) ?? '',
    rsvpEnabled: (c.rsvpEnabled as boolean) ?? false,
    rsvpDeadline: (c.rsvpDeadline as string) ?? '',
    accessCode: (c.accessCode as string) ?? '',
  })
  const [gift, setGift] = useState<GiftState>({
    enabled: props.gift_enabled,
    phone: props.gift_phone ?? '',
    note: props.gift_note ?? '',
  })
  const [giftQrUrl, setGiftQrUrl] = useState(props.gift_qr_url ?? '')
  const [photos, setPhotos] = useState<MediaRow[]>(
    props.media.filter(m => m.type === 'photo').sort((a, b) => a.sort_order - b.sort_order)
  )
  const [music, setMusic] = useState<MediaRow | null>(
    props.media.find(m => m.type === 'audio') ?? null
  )
  const [video, setVideo] = useState<MediaRow | null>(
    props.media.find(m => m.type === 'video') ?? null
  )
  const [pageStatus, setPageStatus] = useState(props.status)
  const [showInGallery, setShowInGallery] = useState(props.show_in_gallery)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [iframeKey, setIframeKey] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [uploadingMusic, setUploadingMusic] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingQr, setUploadingQr] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Ref snapshot so auto-save always reads latest state without stale closures
  const snap = useRef({ content, gift, title, giftQrUrl })
  useEffect(() => { snap.current = { content, gift, title, giftQrUrl } })

  // Auto-save every 30 seconds (silent)
  useEffect(() => {
    const interval = setInterval(async () => {
      const s = snap.current
      await savePage(props.id, {
        title: s.title,
        content: { ...s.content },
        gift_enabled: s.gift.enabled,
        gift_phone: s.gift.phone || null,
        gift_note: s.gift.note || null,
        gift_qr_url: s.giftQrUrl || null,
      })
    }, 30_000)
    return () => clearInterval(interval)
  }, [props.id])

  // ── Completion ─────────────────────────────────────────────────────────────

  const pct = calcCompletion(content, props.page_type, props.tier_name, photos)
  const canSubmit = pct >= 80 && pageStatus === 'draft'

  // ── Save ───────────────────────────────────────────────────────────────────

  async function doSave(showFeedback: boolean) {
    if (showFeedback) setSaveStatus('saving')
    const s = snap.current
    const res = await savePage(props.id, {
      title: s.title,
      content: { ...s.content },
      gift_enabled: s.gift.enabled,
      gift_phone: s.gift.phone || null,
      gift_note: s.gift.note || null,
      gift_qr_url: s.giftQrUrl || null,
    })
    if (showFeedback) {
      if (res.error) {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('saved')
        setIframeKey(k => k + 1)
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    }
  }

  // ── Submit for review ──────────────────────────────────────────────────────

  async function handleSubmitForReview() {
    setSubmitting(true)
    await doSave(false)
    const res = await submitForReview(props.id)
    if (!res.error) setPageStatus('pending_review')
    setSubmitting(false)
  }

  // ── Photo handlers ─────────────────────────────────────────────────────────

  async function handlePhotoUpload(files: FileList) {
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'))
    const currentBytes = photos.reduce((s, p) => s + (p.file_size ?? 0), 0)
    const newBytes = fileArr.reduce((s, f) => s + f.size, 0)
    if (currentBytes + newBytes > 50 * 1024 * 1024) {
      alert('Total photo size cannot exceed 50 MB')
      return
    }
    setUploadingPhotos(true)
    const added: MediaRow[] = []
    for (const file of fileArr) {
      const path = `${props.user_id}/${props.id}/photos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { error } = await supabase.storage.from('page-media').upload(path, file, { upsert: false })
      if (error) continue
      const { data: { publicUrl } } = supabase.storage.from('page-media').getPublicUrl(path)
      const { data: row } = await supabase
        .from('media_files')
        .insert({
          page_id: props.id,
          user_id: props.user_id,
          type: 'photo',
          storage_path: path,
          url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          sort_order: photos.length + added.length,
        })
        .select()
        .single()
      if (row) added.push(row as MediaRow)
    }
    setPhotos(prev => [...prev, ...added])
    setUploadingPhotos(false)
  }

  async function handlePhotoDelete(photo: MediaRow) {
    setDeletingId(photo.id)
    await deleteMediaFile(photo.id, photo.storage_path)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    setDeletingId(null)
  }

  async function handlePhotoDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    const reordered = [...photos]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i }))
    setPhotos(withOrder)
    setDragIndex(null)
    setOverIndex(null)
    await updateMediaOrder(withOrder.map(p => ({ id: p.id, sort_order: p.sort_order })))
  }

  // ── Music handler ──────────────────────────────────────────────────────────

  async function handleMusicUpload(files: FileList) {
    const file = files[0]
    if (!file) return
    if (file.size > 15 * 1024 * 1024) { alert('Music file must be under 15 MB'); return }
    setUploadingMusic(true)
    if (music) await deleteMediaFile(music.id, music.storage_path)
    const path = `${props.user_id}/${props.id}/audio/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('page-media').upload(path, file, { upsert: false })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('page-media').getPublicUrl(path)
      const { data: row } = await supabase
        .from('media_files')
        .insert({
          page_id: props.id, user_id: props.user_id, type: 'audio',
          storage_path: path, url: publicUrl, file_name: file.name,
          file_size: file.size, mime_type: file.type, sort_order: 0,
        })
        .select()
        .single()
      setMusic(row ? (row as MediaRow) : null)
    }
    setUploadingMusic(false)
  }

  // ── Video handler ──────────────────────────────────────────────────────────

  async function handleVideoUpload(files: FileList) {
    const file = files[0]
    if (!file) return
    if (file.size > 300 * 1024 * 1024) { alert('Video file must be under 300 MB'); return }
    setUploadingVideo(true)
    if (video) await deleteMediaFile(video.id, video.storage_path)
    const path = `${props.user_id}/${props.id}/video/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('page-media').upload(path, file, { upsert: false })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('page-media').getPublicUrl(path)
      const { data: row } = await supabase
        .from('media_files')
        .insert({
          page_id: props.id, user_id: props.user_id, type: 'video',
          storage_path: path, url: publicUrl, file_name: file.name,
          file_size: file.size, mime_type: file.type, sort_order: 0,
        })
        .select()
        .single()
      setVideo(row ? (row as MediaRow) : null)
    }
    setUploadingVideo(false)
  }

  // ── Gift QR handler ────────────────────────────────────────────────────────

  async function handleQrUpload(files: FileList) {
    const file = files[0]
    if (!file) return
    setUploadingQr(true)
    const path = `${props.user_id}/${props.id}/gift-qr/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('page-media').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('page-media').getPublicUrl(path)
      setGiftQrUrl(publicUrl)
      snap.current = { ...snap.current, giftQrUrl: publicUrl }
      await savePage(props.id, {
        title, content: { ...content },
        gift_enabled: gift.enabled, gift_phone: gift.phone || null,
        gift_note: gift.note || null, gift_qr_url: publicUrl,
      })
    }
    setUploadingQr(false)
  }

  // ── Content field helper ───────────────────────────────────────────────────

  function setField<K extends keyof ContentFields>(field: K) {
    return (value: ContentFields[K]) => setContent(prev => ({ ...prev, [field]: value }))
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const previewUrl = `/portal/preview/${props.slug}`

  return (
    <div className="flex flex-col overflow-hidden bg-[var(--bg)]" style={{ height: '100dvh' }}>

      {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--surface-3)]">
        <Link
          href="/portal/pages"
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0"
        >
          <IconArrowLeft />
          <span className="hidden sm:inline ml-0.5">My Pages</span>
        </Link>

        <div className="h-4 w-px bg-[var(--border)] shrink-0" />

        <p className="text-sm text-[var(--text)] truncate flex-1 min-w-0">{title}</p>

        {/* Completion indicator */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-20 h-1 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: pct >= 100 ? '#c9a96e' : 'rgba(201,169,110,0.35)',
              }}
            />
          </div>
          <span className={`text-[11px] tabular-nums ${pct >= 100 ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
            {pct}%
          </span>
        </div>

        {pageStatus === 'pending_review' && (
          <span className="hidden sm:inline shrink-0 text-[10px] tracking-[0.2em] uppercase text-amber-400 border border-amber-400/20 rounded-full px-2.5 py-1">
            Under Review
          </span>
        )}

        {/* Save button */}
        <button
          onClick={() => doSave(true)}
          disabled={saveStatus === 'saving'}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-[var(--border-hover)] px-3.5 min-h-[44px] text-xs font-medium transition-all hover:border-[var(--text-dim)] disabled:opacity-50"
        >
          {saveStatus === 'saving' && (
            <><span className="text-[var(--text-muted)]"><IconSpinner /></span><span className="text-[var(--text-muted)]">Saving</span></>
          )}
          {saveStatus === 'saved' && (
            <><span className="text-emerald-400"><IconCheck /></span><span className="text-emerald-400">Saved</span></>
          )}
          {saveStatus === 'error' && <span className="text-red-400">Error — retry</span>}
          {saveStatus === 'idle' && (
            <><span className="text-[var(--text-muted)]"><IconSave /></span><span className="text-[var(--text-muted)]">Save</span></>
          )}
        </button>

        {/* Submit for review */}
        {canSubmit && (
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-3.5 min-h-[44px] text-xs font-semibold text-black transition-all hover:bg-[var(--gold-light)] disabled:opacity-60"
          >
            {submitting ? <IconSpinner /> : <IconSend />}
            <span className="hidden sm:inline">Submit for Review</span>
          </button>
        )}
      </header>

      {/* ── Mobile Tab Bar ────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex border-b border-[var(--surface-3)] md:hidden">
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors ${
              activeTab === tab
                ? 'text-[var(--gold)] border-b-2 border-[var(--gold)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Main Split View ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Form panel ──────────────────────────────────────────────── */}
        <div
          className={`w-full md:w-[40%] overflow-y-auto border-r border-[var(--surface-3)] ${
            activeTab === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          {/* Mobile completion bar */}
          <div className="sm:hidden px-5 pt-4 pb-0 flex items-center gap-2">
            <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: pct >= 100 ? '#c9a96e' : 'rgba(201,169,110,0.35)',
                }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-[var(--text-muted)]">
              Content {pct}% complete
            </span>
          </div>

          <div className="p-5 space-y-8">

            {/* ── Page Identity ──────────────────────────────────────────── */}
            <section>
              <SectionLabel>Page Identity</SectionLabel>
              <div className="space-y-3">
                <div>
                  <FieldLabel>Page Title</FieldLabel>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={INPUT_CLS}
                    placeholder="Your page title"
                  />
                </div>
                <div>
                  <FieldLabel>Subtitle / Tagline</FieldLabel>
                  <input
                    type="text"
                    value={content.subtitle}
                    onChange={e => setField('subtitle')(e.target.value)}
                    className={INPUT_CLS}
                    placeholder="A short line that sets the mood"
                  />
                </div>
              </div>
            </section>

            <Divider />

            {/* ── Names ──────────────────────────────────────────────────── */}
            <section>
              <SectionLabel>Names</SectionLabel>
              <div className="space-y-3">
                <div>
                  <FieldLabel>{nameLabels.name1}</FieldLabel>
                  <input
                    type="text"
                    value={content.name1}
                    onChange={e => setField('name1')(e.target.value)}
                    className={INPUT_CLS}
                    placeholder={nameLabels.name1}
                  />
                </div>
                {hasTwoNames && nameLabels.name2 && (
                  <div>
                    <FieldLabel>{nameLabels.name2}</FieldLabel>
                    <input
                      type="text"
                      value={content.name2}
                      onChange={e => setField('name2')(e.target.value)}
                      className={INPUT_CLS}
                      placeholder={nameLabels.name2}
                    />
                  </div>
                )}
              </div>
            </section>

            <Divider />

            {/* ── Story & Details ────────────────────────────────────────── */}
            <section>
              <SectionLabel>Story & Details</SectionLabel>
              <div className="space-y-3">
                <div>
                  <FieldLabel>Event Date</FieldLabel>
                  <input
                    type="date"
                    value={content.eventDate}
                    onChange={e => setField('eventDate')(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <FieldLabel>Message / Story</FieldLabel>
                  <textarea
                    value={content.story}
                    onChange={e => setField('story')(e.target.value)}
                    rows={7}
                    className={`${INPUT_CLS} resize-none leading-relaxed`}
                    placeholder="Share your story, message, or memories..."
                  />
                </div>
              </div>
            </section>

            <Divider />

            {/* ── Gift ───────────────────────────────────────────────────── */}
            <section>
              <SectionLabel>Gift</SectionLabel>
              <div className="space-y-4">
                <Toggle
                  checked={gift.enabled}
                  onChange={v => setGift(prev => ({ ...prev, enabled: v }))}
                  label="Enable gift section"
                  description="Allow guests to see your payment details"
                />
                {gift.enabled && (
                  <div className="space-y-3 mt-1">
                    <div>
                      <FieldLabel>KBZ Pay Phone Number</FieldLabel>
                      <input
                        type="tel"
                        value={gift.phone}
                        onChange={e => setGift(prev => ({ ...prev, phone: e.target.value }))}
                        className={INPUT_CLS}
                        placeholder="09 xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <FieldLabel>Gift Note (optional)</FieldLabel>
                      <input
                        type="text"
                        value={gift.note}
                        onChange={e => setGift(prev => ({ ...prev, note: e.target.value }))}
                        className={INPUT_CLS}
                        placeholder="e.g. No gifts necessary, your presence is enough"
                      />
                    </div>
                    <div>
                      <FieldLabel>QR Code Image</FieldLabel>
                      {giftQrUrl ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={giftQrUrl}
                            alt="Gift QR code"
                            className="w-20 h-20 object-contain rounded-lg border border-[var(--border-hover)] bg-[var(--surface)] p-1"
                          />
                          <button
                            onClick={() => {
                              setGiftQrUrl('')
                              snap.current = { ...snap.current, giftQrUrl: '' }
                            }}
                            className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <DropZone
                          onFiles={handleQrUpload}
                          accept="image/*"
                          uploading={uploadingQr}
                          hint="Upload QR code image"
                          sizeLimit="5 MB"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Photos (Premium+) ──────────────────────────────────────── */}
            {isPremiumPlus && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Photos</SectionLabel>
                  <div className="space-y-3">
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, i) => (
                          <div
                            key={photo.id}
                            draggable
                            onDragStart={() => setDragIndex(i)}
                            onDragOver={e => { e.preventDefault(); setOverIndex(i) }}
                            onDrop={() => handlePhotoDrop(i)}
                            onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                            className={`relative aspect-square rounded-lg overflow-hidden group border transition-all ${
                              overIndex === i && dragIndex !== i
                                ? 'border-[var(--gold)]/60 scale-[1.03]'
                                : 'border-[var(--border-hover)]'
                            } ${dragIndex === i ? 'opacity-40 cursor-grabbing' : 'cursor-grab'}`}
                          >
                            <img
                              src={photo.url}
                              alt={photo.file_name}
                              className="w-full h-full object-cover pointer-events-none select-none"
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />
                            <button
                              onClick={e => { e.stopPropagation(); handlePhotoDelete(photo) }}
                              disabled={deletingId === photo.id}
                              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-900/80 disabled:opacity-40"
                            >
                              {deletingId === photo.id ? <IconSpinner /> : <IconTrash />}
                            </button>
                            <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 pointer-events-none">
                              <IconGrip />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <DropZone
                      onFiles={handlePhotoUpload}
                      accept="image/*"
                      multiple
                      uploading={uploadingPhotos}
                      hint={photos.length > 0 ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} — add more` : 'Drag photos here or click to browse'}
                      sizeLimit="50 MB total"
                    />
                  </div>
                </section>
              </>
            )}

            {/* ── Background Music (Premium+) ────────────────────────────── */}
            {isPremiumPlus && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Background Music</SectionLabel>
                  {music ? (
                    <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
                      <span className="text-[var(--gold)] shrink-0"><IconMusic /></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text)] truncate">{music.file_name}</p>
                        {music.file_size !== undefined && (
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{fmtBytes(music.file_size)}</p>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          await deleteMediaFile(music.id, music.storage_path)
                          setMusic(null)
                        }}
                        className="shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  ) : (
                    <DropZone
                      onFiles={handleMusicUpload}
                      accept="audio/mpeg,audio/mp3,audio/aac,audio/mp4,.mp3,.aac,.m4a"
                      uploading={uploadingMusic}
                      hint="Upload MP3 or AAC"
                      sizeLimit="15 MB"
                    >
                      <span className="text-[var(--text-muted)]"><IconMusic /></span>
                    </DropZone>
                  )}
                </section>
              </>
            )}

            {/* ── Countdown (Premium+) ───────────────────────────────────── */}
            {isPremiumPlus && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Countdown</SectionLabel>
                  <div>
                    <FieldLabel>Target Date</FieldLabel>
                    <input
                      type="date"
                      value={content.countdownDate}
                      onChange={e => setField('countdownDate')(e.target.value)}
                      className={INPUT_CLS}
                    />
                    <p className="text-[10px] text-[var(--text-dim)] mt-1.5">
                      Leave empty to hide the countdown section
                    </p>
                  </div>
                </section>
              </>
            )}

            {/* ── Video Message (Luxury) ─────────────────────────────────── */}
            {isLuxury && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Video Message</SectionLabel>
                  {video ? (
                    <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
                      <span className="text-[var(--gold)] shrink-0"><IconVideo /></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text)] truncate">{video.file_name}</p>
                        {video.file_size !== undefined && (
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{fmtBytes(video.file_size)}</p>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          await deleteMediaFile(video.id, video.storage_path)
                          setVideo(null)
                        }}
                        className="shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  ) : (
                    <DropZone
                      onFiles={handleVideoUpload}
                      accept="video/mp4,video/quicktime,.mp4,.mov"
                      uploading={uploadingVideo}
                      hint="Upload MP4 or MOV"
                      sizeLimit="300 MB"
                    >
                      <span className="text-[var(--text-muted)]"><IconVideo /></span>
                    </DropZone>
                  )}
                </section>
              </>
            )}

            {/* ── Invitation Details ─────────────────────────────────────── */}
            {isInvitation && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Invitation Details</SectionLabel>
                  <div className="space-y-5">
                    {/* Venue */}
                    <div className="space-y-3">
                      <div>
                        <FieldLabel>Venue Name</FieldLabel>
                        <input
                          type="text"
                          value={content.venueName}
                          onChange={e => setField('venueName')(e.target.value)}
                          className={INPUT_CLS}
                          placeholder="e.g. Grand Ballroom, Chatrium Hotel"
                        />
                      </div>
                      <div>
                        <FieldLabel>Venue Address</FieldLabel>
                        <textarea
                          value={content.venueAddress}
                          onChange={e => setField('venueAddress')(e.target.value)}
                          rows={2}
                          className={`${INPUT_CLS} resize-none`}
                          placeholder="Full address including city"
                        />
                      </div>
                      <div>
                        <FieldLabel>Dress Code (optional)</FieldLabel>
                        <input
                          type="text"
                          value={content.dresscode}
                          onChange={e => setField('dresscode')(e.target.value)}
                          className={INPUT_CLS}
                          placeholder="e.g. Formal attire, Black tie optional"
                        />
                      </div>
                    </div>

                    <Divider />

                    {/* RSVP */}
                    <Toggle
                      checked={content.rsvpEnabled}
                      onChange={v => setField('rsvpEnabled')(v)}
                      label="Enable RSVP"
                      description="Allow guests to confirm their attendance"
                    />
                    {content.rsvpEnabled && (
                      <div className="space-y-3 mt-1">
                        <div>
                          <FieldLabel>RSVP Deadline</FieldLabel>
                          <input
                            type="date"
                            value={content.rsvpDeadline}
                            onChange={e => setField('rsvpDeadline')(e.target.value)}
                            className={INPUT_CLS}
                          />
                        </div>
                        <div>
                          <FieldLabel>Access Code (optional)</FieldLabel>
                          <input
                            type="text"
                            value={content.accessCode}
                            onChange={e => setField('accessCode')(e.target.value)}
                            className={INPUT_CLS}
                            placeholder="Leave empty for public access"
                          />
                          <p className="text-[10px] text-[var(--text-dim)] mt-1.5">
                            Guests must enter this code to view the page
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* ── Share & QR Code ────────────────────────────────────── */}
            {props.status === 'active' && (
              <>
                <Divider />
                <section>
                  <SectionLabel>Share Your Page</SectionLabel>
                  <PageQRSection slug={props.slug} title={props.title} />
                </section>
              </>
            )}

            {/* ── Gallery Visibility ─────────────────────────────────── */}
            <Divider />
            <section>
              <SectionLabel>Public Gallery</SectionLabel>
              <Toggle
                checked={showInGallery}
                onChange={async (v) => {
                  setShowInGallery(v)
                  await updateGalleryVisibility(props.id, v)
                }}
                label="Show this page in public gallery"
                description="Your page will appear on the gallery for everyone to discover"
              />
            </section>

            {/* Bottom padding for mobile bottom nav clearance */}
            <div className="h-8" />
          </div>
        </div>

        {/* ── Right: Preview iframe ────────────────────────────────────────── */}
        <div
          className={`flex-1 bg-[var(--bg)] ${
            activeTab === 'edit' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="w-full h-full flex flex-col">
            <div className="shrink-0 flex items-center justify-center py-2 px-4 border-b border-[var(--surface-3)]">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">
                Live Preview — saves to refresh
              </p>
            </div>
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="flex-1 w-full border-0"
              title="Page preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PageQRSection({ slug, title }: { slug: string; title: string }) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${siteUrl}/p/${slug}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const downloadQR = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/qr?slug=${encodeURIComponent(slug)}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="self-start rounded-xl p-3 flex flex-col items-center gap-2"
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
      >
        <img
          src={`/api/qr?slug=${encodeURIComponent(slug)}`}
          alt="QR code"
          width={160}
          height={160}
          style={{ imageRendering: 'pixelated' }}
        />
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#c9a96e', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
          Our Memories
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={downloadQR}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium tracking-widest uppercase transition-opacity disabled:opacity-50"
          style={{ background: '#c9a96e', color: '#0a0a0a' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloading ? 'Downloading…' : 'Download QR'}
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] tracking-widest uppercase border transition-colors"
          style={{
            borderColor: linkCopied ? 'rgba(52,211,153,0.4)' : 'rgba(201,169,110,0.25)',
            color: linkCopied ? '#34d399' : '#c9a96e',
            background: linkCopied ? 'rgba(52,211,153,0.08)' : 'transparent',
          }}
        >
          {linkCopied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          {linkCopied ? 'Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
