'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadScreenshot } from './actions'
import type { OrderDetails, PaymentSettings } from './actions'

const METHOD_LABELS: Record<string, string> = {
  kbz_pay: 'KBZ Pay',
  wave_money: 'Wave Money',
  aya_pay: 'AYA Pay',
  bangkok_bank_qr: 'Bangkok Bank QR',
  true_money: 'True Money',
}

type Props = {
  order: OrderDetails
  settings: PaymentSettings
  orderId: string
}

export default function PayUploadClient({ order, settings, orderId }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const tierName = (order.tiers as { name: string }).name
  const durationLabel = order.duration_prices?.label ?? 'Lifetime'
  const pageTitle = (order.pages as { title: string }).title

  const methods = [
    { key: 'kbz_pay', label: 'KBZ Pay', phone: settings.kbz_pay_phone, qrUrl: settings.kbz_pay_qr_url },
    { key: 'wave_money', label: 'Wave Money', phone: settings.wave_money_phone, qrUrl: '' },
    { key: 'aya_pay', label: 'AYA Pay', phone: settings.aya_pay_phone, qrUrl: '' },
    { key: 'bangkok_bank_qr', label: 'Bangkok Bank QR', phone: '', qrUrl: settings.bangkok_bank_qr_url },
    { key: 'true_money', label: 'True Money', phone: settings.true_money_phone, qrUrl: '' },
  ]

  function acceptFile(f: File) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, or WEBP images are allowed')
      setFile(null); setPreview(null)
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError(`File is too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`)
      setFile(null); setPreview(null)
      return
    }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) acceptFile(f)
  }

  async function handleSubmit() {
    if (!file) return
    setUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append('screenshot', file)
    const result = await uploadScreenshot(orderId, fd)
    if (!result.success) {
      setError(result.error ?? 'Upload failed. Please try again.')
      setUploading(false)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/portal/pages'), 3000)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--gold)]/15 flex items-center justify-center mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-lg font-light text-[var(--text)] mb-2">Payment Screenshot Received</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xs">
          Our team will review and approve your order shortly. Redirecting you now...
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">Complete Payment</p>
        <h1 className="text-2xl font-light text-[var(--text)]">Upload Payment Screenshot</h1>
      </div>

      {/* Order Summary */}
      <div className="border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-alt)]">
          <p className="text-xs tracking-widest uppercase text-[var(--text-muted)]">Order Summary</p>
        </div>
        <div className="bg-[var(--surface)]">
          <SummaryRow label="Page" value={pageTitle} />
          <SummaryRow label="Plan" value={tierName} />
          <SummaryRow label="Duration" value={durationLabel} />
          <SummaryRow label="Payment Method" value={METHOD_LABELS[order.payment_method] ?? order.payment_method} />
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--border)]">
            <p className="text-xs tracking-widest uppercase text-[var(--text)] font-medium">Total</p>
            <p className="text-base font-light text-[var(--gold)]">
              {Number(order.amount).toLocaleString()} <span className="text-xs text-[var(--text-muted)]">MMK</span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4">Send Payment To</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {methods.map((m) => {
            const chosen = m.key === order.payment_method
            const hasDetails = m.phone || m.qrUrl
            return (
              <div
                key={m.key}
                className={`rounded-xl border p-4 transition-colors ${
                  chosen
                    ? 'border-[var(--gold)]/50 bg-[var(--gold)]/5'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-sm font-medium ${chosen ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
                    {m.label}
                  </p>
                  {chosen && (
                    <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                      Your choice
                    </span>
                  )}
                </div>

                {!hasDetails && (
                  <p className="text-xs text-[var(--text-dim)] italic">Details not configured yet</p>
                )}

                {m.phone && (
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm text-[var(--text)] font-mono tracking-wide">{m.phone}</span>
                  </div>
                )}

                {m.qrUrl && (
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.qrUrl}
                      alt={`${m.label} QR code`}
                      className="w-32 h-32 object-contain rounded-lg bg-white p-1"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upload Section */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4">Upload Screenshot</p>

        {!preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`w-full rounded-xl border-2 border-dashed py-12 flex flex-col items-center gap-3 transition-colors cursor-pointer ${
              dragging
                ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                : 'border-[var(--border-hover)] bg-[var(--surface-alt)] hover:border-[var(--text-dim)] hover:bg-[var(--surface)]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--text)]">
                {dragging ? 'Drop your screenshot here' : 'Click or drag to upload'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG, WEBP — max 5MB</p>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-[var(--surface-alt)] border border-[var(--border-hover)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Payment screenshot preview" className="w-full max-h-72 object-contain" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); setError(null) }}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--bg)]/80 border border-[var(--border-hover)] flex items-center justify-center hover:bg-[var(--surface-3)] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{file?.name}</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[var(--gold)] text-[var(--bg)] text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {uploading ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Submit Screenshot
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-xs text-[var(--text)] text-right max-w-[60%] truncate">{value}</p>
    </div>
  )
}
