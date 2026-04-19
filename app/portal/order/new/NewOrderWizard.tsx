'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkSlugAvailable, submitOrder } from './actions'

type Tier = {
  id: string
  name: string
  features: string[]
  sort_order: number
}

type DurationPrice = {
  id: string
  tier_id: string
  duration_months: number
  price: number
  label: string
}

type Template = {
  id: string
  name: string
  slug: string
  tier_id: string
  page_type: string
  thumbnail_url: string | null
}

type Props = {
  tiers: Tier[]
  durationPrices: DurationPrice[]
  templates: Template[]
}

type WizardData = {
  pageType: string | null
  tierId: string | null
  templateId: string | null
  durationPriceId: string | null
  title: string
  slug: string
  paymentMethod: string | null
}

const PAGE_TYPES = [
  { value: 'wedding_celebration', label: 'Wedding Celebration', icon: <IconWedding /> },
  { value: 'birthday_wish', label: 'Birthday Wish', icon: <IconBirthday /> },
  { value: 'wedding_invitation', label: 'Wedding Invitation', icon: <IconEnvelope /> },
  { value: 'anniversary', label: 'Anniversary', icon: <IconAnniversary /> },
  { value: 'memorial_tribute', label: 'Memorial & Tribute', icon: <IconMemorial /> },
  { value: 'love_letter', label: 'Love Letter', icon: <IconHeart /> },
  { value: 'gender_reveal', label: 'Gender Reveal', icon: <IconStar /> },
  { value: 'birthday_invitation', label: 'Birthday Invitation', icon: <IconSparkle /> },
  { value: 'ceremony_invitation', label: 'Ceremony Invitation', icon: <IconBell /> },
  { value: 'custom_page', label: 'Custom Page', icon: <IconEdit /> },
]

const PAYMENT_METHODS = [
  { value: 'kbz_pay', label: 'KBZ Pay' },
  { value: 'wave_money', label: 'Wave Money' },
  { value: 'aya_pay', label: 'AYA Pay' },
  { value: 'bangkok_bank_qr', label: 'Bangkok Bank QR' },
  { value: 'true_money', label: 'True Money' },
]

const STEP_LABELS = ['Page Type', 'Plan', 'Template', 'Duration', 'Details']

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewOrderWizard({ tiers, durationPrices, templates }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [data, setData] = useState<WizardData>({
    pageType: null,
    tierId: null,
    templateId: null,
    durationPriceId: null,
    title: '',
    slug: '',
    paymentMethod: null,
  })
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!data.slug) {
      setSlugStatus('idle')
      return
    }
    setSlugStatus('checking')
    const timer = setTimeout(async () => {
      const available = await checkSlugAvailable(data.slug)
      setSlugStatus(available ? 'available' : 'taken')
    }, 500)
    return () => clearTimeout(timer)
  }, [data.slug])

  const canProceed = (): boolean => {
    if (step === 1) return !!data.pageType
    if (step === 2) return !!data.tierId
    if (step === 3) return !!data.templateId
    if (step === 4) return !!data.durationPriceId
    if (step === 5)
      return (
        data.title.trim().length > 0 &&
        data.slug.length > 0 &&
        slugStatus === 'available' &&
        !!data.paymentMethod
      )
    return false
  }

  const next = () => {
    if (step < 5) setStep((s) => (s + 1) as typeof step)
  }
  const back = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step)
  }

  const handleSubmit = async () => {
    if (!data.tierId || !data.templateId || !data.durationPriceId || !data.paymentMethod) return
    setSubmitting(true)
    setSubmitError(null)
    const result = await submitOrder({
      templateId: data.templateId,
      tierId: data.tierId,
      durationPriceId: data.durationPriceId,
      title: data.title,
      slug: data.slug,
      paymentMethod: data.paymentMethod,
    })
    if (result.success && result.orderId) {
      router.push(`/portal/order/${result.orderId}/pay`)
    } else {
      setSubmitError(result.error ?? 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const selectedTier = tiers.find((t) => t.id === data.tierId)
  const selectedTemplate = templates.find((t) => t.id === data.templateId)
  const selectedDuration = durationPrices.find((d) => d.id === data.durationPriceId)
  const selectedPageTypeLabel = PAGE_TYPES.find((pt) => pt.value === data.pageType)?.label

  const filteredTemplates = templates.filter(
    (t) => t.tier_id === data.tierId && t.page_type === data.pageType
  )

  const filteredDurations = durationPrices.filter((d) => d.tier_id === data.tierId)

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">New Order</p>
        <h1 className="text-2xl font-light text-[var(--text)]">Create a Page</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-10">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    done
                      ? 'bg-[var(--gold)] text-[var(--bg)]'
                      : active
                      ? 'bg-[var(--gold)]/20 text-[var(--gold)] ring-1 ring-[var(--gold)]'
                      : 'bg-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    n
                  )}
                </div>
                <span className={`mt-1.5 text-[10px] tracking-wide hidden sm:block ${active ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 sm:mb-5 ${done ? 'bg-[var(--gold)]/40' : 'bg-[var(--border)]'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Page Type */}
      {step === 1 && (
        <div>
          <h2 className="text-base font-light text-[var(--text)] mb-1">What are you celebrating?</h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">Choose a page type to get started.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PAGE_TYPES.map((pt) => (
              <button
                key={pt.value}
                onClick={() => setData((d) => ({ ...d, pageType: pt.value, templateId: null }))}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center transition-all ${
                  data.pageType === pt.value
                    ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)]'
                }`}
              >
                <span className="shrink-0">{pt.icon}</span>
                <span className="text-[11px] leading-tight">{pt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Tier */}
      {step === 2 && (
        <div>
          <h2 className="text-base font-light text-[var(--text)] mb-1">Choose your plan</h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">All plans include a lifetime link — no subscriptions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier) => {
              const dp = durationPrices.find((d) => d.tier_id === tier.id)
              return (
                <button
                  key={tier.id}
                  onClick={() => setData((d) => ({ ...d, tierId: tier.id, templateId: null, durationPriceId: null }))}
                  className={`flex flex-col text-left p-5 rounded-xl border transition-all ${
                    data.tierId === tier.id
                      ? 'border-[var(--gold)] bg-[var(--gold)]/10'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${data.tierId === tier.id ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
                      {tier.name}
                    </span>
                    {data.tierId === tier.id && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {dp && (
                    <p className="text-lg font-light text-[var(--text)] mb-3">
                      {Number(dp.price).toLocaleString()}{' '}
                      <span className="text-xs text-[var(--text-muted)]">MMK</span>
                    </p>
                  )}
                  <ul className="space-y-1.5">
                    {(tier.features as string[]).slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-muted)]">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                    {(tier.features as string[]).length > 4 && (
                      <li className="text-[11px] text-[var(--text-muted)]/60">
                        +{(tier.features as string[]).length - 4} more
                      </li>
                    )}
                  </ul>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3 — Template */}
      {step === 3 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-light text-[var(--text)]">Choose a template</h2>
            <a
              href="/templates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-wide transition-colors"
              style={{ color: 'var(--gold)', opacity: 0.7 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7' }}
            >
              Browse all templates →
            </a>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            {selectedTier?.name} templates for {selectedPageTypeLabel}.
          </p>
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--surface)] border border-[var(--border)] rounded-xl">
              <p className="text-sm text-[var(--text-muted)] mb-1">No templates available yet</p>
              <p className="text-xs text-[var(--text-muted)]/60">Templates for this combination are coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setData((d) => ({ ...d, templateId: tmpl.id }))}
                  className={`flex flex-col text-left rounded-xl border overflow-hidden transition-all ${
                    data.templateId === tmpl.id
                      ? 'border-[var(--gold)]'
                      : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="aspect-video bg-[var(--surface-3)] relative">
                    {tmpl.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tmpl.thumbnail_url} alt={tmpl.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    {data.templateId === tmpl.id && (
                      <div className="absolute inset-0 bg-[var(--gold)]/20 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-[var(--gold)] flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2.5 bg-[var(--surface)]">
                    <p className={`text-xs font-medium ${data.templateId === tmpl.id ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
                      {tmpl.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Duration */}
      {step === 4 && (
        <div>
          <h2 className="text-base font-light text-[var(--text)] mb-1">Choose duration</h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">How long would you like your page to be active?</p>
          <div className="flex flex-col gap-3 max-w-sm">
            {filteredDurations.map((dp) => (
              <button
                key={dp.id}
                onClick={() => setData((d) => ({ ...d, durationPriceId: dp.id }))}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  data.durationPriceId === dp.id
                    ? 'border-[var(--gold)] bg-[var(--gold)]/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="text-left">
                  <p className={`text-sm font-medium ${data.durationPriceId === dp.id ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
                    {dp.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {dp.duration_months === 0 ? 'Never expires' : `${dp.duration_months} months`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--text)]">
                    {Number(dp.price).toLocaleString()} <span className="text-xs text-[var(--text-muted)]">MMK</span>
                  </span>
                  {data.durationPriceId === dp.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — Details */}
      {step === 5 && (
        <div>
          <h2 className="text-base font-light text-[var(--text)] mb-1">Almost there</h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">Name your page and choose how to pay.</p>

          <div className="space-y-5 max-w-lg mb-8">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => {
                  const title = e.target.value
                  setData((d) => ({
                    ...d,
                    title,
                    slug: generateSlug(title),
                  }))
                }}
                placeholder="e.g. Sarah & John's Wedding"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-base text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2">
                Page URL
              </label>
              <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 gap-2 focus-within:border-[var(--gold)]/50 transition-colors">
                <span className="text-xs text-[var(--text-dim)] shrink-0">our-memories.store/</span>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) =>
                    setData((d) => ({ ...d, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))
                  }
                  className="flex-1 bg-transparent text-base text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none min-w-0"
                  placeholder="your-page-name"
                />
                <span className="shrink-0">
                  {slugStatus === 'checking' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  )}
                  {slugStatus === 'available' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {slugStatus === 'taken' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </span>
              </div>
              {slugStatus === 'taken' && (
                <p className="mt-1.5 text-xs text-red-400">This URL is already taken. Please choose another.</p>
              )}
              {slugStatus === 'available' && (
                <p className="mt-1.5 text-xs text-emerald-400">URL is available.</p>
              )}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setData((d) => ({ ...d, paymentMethod: pm.value }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all ${
                      data.paymentMethod === pm.value
                        ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      data.paymentMethod === pm.value ? 'border-[var(--gold)]' : 'border-[var(--text-dim)]'
                    }`}>
                      {data.paymentMethod === pm.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                      )}
                    </div>
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {data.tierId && data.durationPriceId && (
            <div className="max-w-lg border border-[var(--border)] rounded-xl overflow-hidden mb-2">
              <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-alt)]">
                <p className="text-xs tracking-widest uppercase text-[var(--text-muted)]">Order Summary</p>
              </div>
              <div className="bg-[var(--surface)]">
                <SummaryRow label="Page Type" value={selectedPageTypeLabel ?? '—'} />
                <SummaryRow label="Plan" value={selectedTier?.name ?? '—'} />
                <SummaryRow label="Template" value={selectedTemplate?.name ?? '—'} />
                <SummaryRow
                  label="Duration"
                  value={
                    selectedDuration
                      ? `${selectedDuration.label}${selectedDuration.duration_months === 0 ? ' (Lifetime)' : ` · ${selectedDuration.duration_months}mo`}`
                      : '—'
                  }
                />
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--border)]">
                  <p className="text-xs tracking-widest uppercase text-[var(--text)] font-medium">Total</p>
                  <p className="text-base font-light text-[var(--gold)]">
                    {selectedDuration ? `${Number(selectedDuration.price).toLocaleString()} MMK` : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <p className="mt-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
        <button
          onClick={back}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-full border border-[var(--border)] text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        {step < 5 ? (
          <button
            onClick={next}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-6 min-h-[44px] rounded-full border border-[var(--gold)]/40 text-xs tracking-widest uppercase text-[var(--text)] hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="inline-flex items-center gap-2 px-6 min-h-[44px] rounded-full bg-[var(--gold)] text-[var(--bg)] text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Order'
            )}
          </button>
        )}
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

function IconWedding() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5C12 20.5 3 15 3 9a4 4 0 0 1 7.5-1.8A4 4 0 0 1 21 9c0 6-9 11.5-9 11.5z" />
    </svg>
  )
}

function IconBirthday() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconEnvelope() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconAnniversary() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5C12 20.5 3 15 3 9a4 4 0 0 1 7.5-1.8A4 4 0 0 1 21 9c0 6-9 11.5-9 11.5z" />
      <path d="M18 8c0-1.66-1.34-3-3-3" />
    </svg>
  )
}

function IconMemorial() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="8" />
      <path d="M5 10c0-1.5 1-2.5 2.5-2.5S10 9 10 10.5c0 2.5-5 6-5 6h10s-5-3.5-5-6z" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="12" y1="16" x2="12" y2="22" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C12 3 13.5 7.5 18 9c-4.5 1.5-6 6-6 6s-1.5-4.5-6-6c4.5-1.5 6-6 6-6z" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
