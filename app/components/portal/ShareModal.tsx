'use client'

import { useState, useEffect } from 'react'
import QRCodeImage from './QRCodeImage'

interface ShareModalProps {
  slug: string
  title: string
  onClose: () => void
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export function ShareModal({ slug, title, onClose }: ShareModalProps) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [instaCopied, setInstaCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const pageUrl = `${siteUrl}/p/${slug}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl)
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

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank', 'width=600,height=400')
  }

  const shareToInstagram = async () => {
    await navigator.clipboard.writeText(pageUrl)
    setInstaCopied(true)
    setTimeout(() => setInstaCopied(false), 3000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-xs rounded-2xl border p-6 flex flex-col items-center gap-5"
        style={{ background: '#0f0f0f', borderColor: '#1e1e1e' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full transition-colors"
          style={{ color: '#6b6b6b' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f5e6c8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
          aria-label="Close"
        >
          <IconX />
        </button>

        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#c9a96e', opacity: 0.6 }}>
            Share
          </p>
          <h2 className="text-sm font-light" style={{ color: '#f5e6c8' }}>{title}</h2>
        </div>

        <div
          className="rounded-xl p-3 flex flex-col items-center gap-2"
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
        >
          <QRCodeImage slug={slug} size={120} className="sm:hidden" />
          <QRCodeImage slug={slug} size={180} className="hidden sm:block" />
          <p
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: '#c9a96e', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}
          >
            Our Memories
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={downloadQR}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 min-h-[44px] rounded-lg text-xs font-medium tracking-widest uppercase transition-opacity disabled:opacity-50"
            style={{ background: '#c9a96e', color: '#0a0a0a' }}
          >
            <IconDownload />
            {downloading ? 'Downloading…' : 'Download QR Code'}
          </button>

          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs tracking-widest uppercase border transition-colors"
            style={{
              borderColor: linkCopied ? 'rgba(52,211,153,0.4)' : 'rgba(201,169,110,0.25)',
              color: linkCopied ? '#34d399' : '#c9a96e',
              background: linkCopied ? 'rgba(52,211,153,0.08)' : 'transparent',
            }}
          >
            {linkCopied ? <IconCheck /> : <IconCopy />}
            {linkCopied ? 'Link Copied' : 'Copy Link'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={shareToFacebook}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg text-xs tracking-widest uppercase border transition-colors"
              style={{ borderColor: '#1e1e1e', color: '#6b6b6b' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'
                e.currentTarget.style.color = '#f5e6c8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e1e'
                e.currentTarget.style.color = '#6b6b6b'
              }}
            >
              <IconFacebook />
              Facebook
            </button>

            <button
              onClick={shareToInstagram}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg text-xs tracking-widest uppercase border transition-colors"
              style={{
                borderColor: instaCopied ? 'rgba(201,169,110,0.25)' : '#1e1e1e',
                color: instaCopied ? '#c9a96e' : '#6b6b6b',
              }}
              onMouseEnter={e => {
                if (!instaCopied) {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'
                  e.currentTarget.style.color = '#f5e6c8'
                }
              }}
              onMouseLeave={e => {
                if (!instaCopied) {
                  e.currentTarget.style.borderColor = '#1e1e1e'
                  e.currentTarget.style.color = '#6b6b6b'
                }
              }}
            >
              <IconInstagram />
              {instaCopied ? 'Copied!' : 'Instagram'}
            </button>
          </div>

          {instaCopied && (
            <p className="text-center text-[10px]" style={{ color: '#6b6b6b' }}>
              Link copied — paste it in your Instagram bio or story
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface ShareButtonProps {
  slug: string
  title: string
}

export function ShareButton({ slug, title }: ShareButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>
      {open && <ShareModal slug={slug} title={title} onClose={() => setOpen(false)} />}
    </>
  )
}
