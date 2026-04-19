'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { updateDurationPrice, updateDurationLabel } from './actions'

type DurationPrice = {
  id: string
  duration_months: number
  price: number
  label: string
  is_active: boolean
}

type Tier = {
  id: string
  name: string
  sort_order: number
  duration_prices: DurationPrice[]
}

function PriceRow({ row, tierId }: { row: DurationPrice; tierId: string }) {
  const [price, setPrice] = useState(String(row.price))
  const [label, setLabel] = useState(row.label)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const savedTimer = useRef<ReturnType<typeof setTimeout>>()

  const save = () => {
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) return
    if (String(numPrice) === String(row.price) && label === row.label) return

    setStatus('saving')
    startTransition(async () => {
      const results = await Promise.all([
        numPrice !== row.price ? updateDurationPrice(row.id, numPrice) : Promise.resolve({ success: true }),
        label !== row.label ? updateDurationLabel(row.id, label) : Promise.resolve({ success: true }),
      ])
      const hasError = results.some((r) => r.error)
      if (hasError) {
        setStatus('error')
      } else {
        setStatus('saved')
        savedTimer.current = setTimeout(() => setStatus('idle'), 2000)
      }
    })
  }

  useEffect(() => () => { if (savedTimer.current) clearTimeout(savedTimer.current) }, [])

  const durationLabel = row.duration_months === 0 ? 'Lifetime' : `${row.duration_months} month${row.duration_months > 1 ? 's' : ''}`
  const saveIndicator = (
    <>
      {status === 'saving' && <span className="text-xs text-[var(--text-muted)]">Saving…</span>}
      {status === 'saved' && <span className="text-xs text-green-400">Saved</span>}
      {status === 'error' && <span className="text-xs text-red-400">Error</span>}
    </>
  )

  return (
    <>
      {/* Mobile card row */}
      <div className="md:hidden px-4 py-3 border-b border-[var(--surface-3)] last:border-0">
        <div className="flex items-center justify-between mb-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={save}
            className="bg-transparent text-sm text-[var(--text)] border-b border-transparent hover:border-[var(--border-hover)] focus:border-[var(--gold)]/50 focus:outline-none transition-colors flex-1 mr-3"
          />
          <span className="text-xs text-[var(--text-muted)] shrink-0">{durationLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={save}
            min={0}
            step={1000}
            className="flex-1 px-2 py-1 rounded bg-[var(--surface-alt)] border border-[var(--border-hover)] text-base text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
          />
          <span className="text-xs text-[var(--text-muted)] shrink-0">MMK</span>
          {saveIndicator}
        </div>
      </div>

      {/* Desktop table row */}
      <tr className="hidden md:table-row border-b border-[var(--surface-3)] last:border-0">
        <td className="px-5 py-3.5">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={save}
            className="bg-transparent text-sm text-[var(--text)] border-b border-transparent hover:border-[var(--border-hover)] focus:border-[var(--gold)]/50 focus:outline-none transition-colors w-40"
          />
        </td>
        <td className="px-5 py-3.5 text-[var(--text-muted)] text-sm">{durationLabel}</td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={save}
              min={0}
              step={1000}
              className="w-32 px-2 py-1 rounded bg-[var(--surface-alt)] border border-[var(--border-hover)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
            />
            <span className="text-xs text-[var(--text-muted)]">MMK</span>
          </div>
        </td>
        <td className="px-5 py-3.5 w-20">{saveIndicator}</td>
      </tr>
    </>
  )
}

export default function AdminPricingPage() {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('tiers')
        .select(`
          id, name, sort_order,
          duration_prices (id, duration_months, price, label, is_active)
        `)
        .eq('is_active', true)
        .order('sort_order')

      setTiers((data as unknown as Tier[]) ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Pricing</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Edit prices — changes save automatically on blur</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
                <h2 className="text-sm font-semibold text-[var(--text)]">{tier.name}</h2>
                <span className="text-xs text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded">
                  {tier.duration_prices?.filter((d) => d.is_active).length ?? 0} options
                </span>
              </div>
              {/* Mobile stacked view */}
              <div className="md:hidden">
                {(tier.duration_prices ?? [])
                  .filter((d) => d.is_active)
                  .sort((a, b) => a.duration_months - b.duration_months)
                  .map((dp) => (
                    <PriceRow key={dp.id} row={dp} tierId={tier.id} />
                  ))}
              </div>

              {/* Desktop table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {['Label', 'Duration', 'Price', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs text-[var(--text-muted)] font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(tier.duration_prices ?? [])
                      .filter((d) => d.is_active)
                      .sort((a, b) => a.duration_months - b.duration_months)
                      .map((dp) => (
                        <PriceRow key={dp.id} row={dp} tierId={tier.id} />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
