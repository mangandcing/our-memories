'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { updateSetting } from './actions'

type Setting = { key: string; value: string }

const PAYMENT_METHODS = [
  {
    id: 'kbz_pay',
    label: 'KBZ Pay',
    fields: [
      { key: 'kbz_pay_phone', label: 'Phone Number', placeholder: '09-xxx-xxx-xxx', type: 'text' },
      { key: 'kbz_pay_qr_url', label: 'QR Image URL', placeholder: 'https://…', type: 'url' },
    ],
  },
  {
    id: 'wave_money',
    label: 'Wave Money',
    fields: [
      { key: 'wave_money_phone', label: 'Phone Number', placeholder: '09-xxx-xxx-xxx', type: 'text' },
    ],
  },
  {
    id: 'aya_pay',
    label: 'AYA Pay',
    fields: [
      { key: 'aya_pay_phone', label: 'Phone Number', placeholder: '09-xxx-xxx-xxx', type: 'text' },
    ],
  },
  {
    id: 'bangkok_bank',
    label: 'Bangkok Bank QR',
    fields: [
      { key: 'bangkok_bank_qr_url', label: 'QR Image URL', placeholder: 'https://…', type: 'url' },
    ],
  },
  {
    id: 'true_money',
    label: 'True Money',
    fields: [
      { key: 'true_money_phone', label: 'Phone Number', placeholder: '09-xxx-xxx-xxx', type: 'text' },
    ],
  },
]

function SettingField({
  fieldKey,
  label,
  placeholder,
  type,
  initialValue,
}: {
  fieldKey: string
  label: string
  placeholder: string
  type: string
  initialValue: string
}) {
  const [value, setValue] = useState(initialValue)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setValue(initialValue) }, [initialValue])

  const save = () => {
    if (value === initialValue) return
    setStatus('saving')
    startTransition(async () => {
      const res = await updateSetting(fieldKey, value)
      if (res.error) {
        setStatus('error')
      } else {
        setStatus('saved')
        savedTimer.current = setTimeout(() => setStatus('idle'), 2000)
      }
    })
  }

  useEffect(() => () => { if (savedTimer.current) clearTimeout(savedTimer.current) }, [])

  return (
    <div>
      <label className="block text-xs text-[var(--text-muted)] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface-alt)] border border-[var(--border-hover)] text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
        />
        {status === 'saving' && <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Saving…</span>}
        {status === 'saved' && <span className="text-xs text-green-400 whitespace-nowrap">Saved</span>}
        {status === 'error' && <span className="text-xs text-red-400 whitespace-nowrap">Error</span>}
      </div>
      {type === 'url' && value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors inline-block"
        >
          Preview image
        </a>
      )}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('admin_settings').select('key, value')
      const map: Record<string, string> = {}
      for (const row of (data ?? []) as Setting[]) {
        map[row.key] = row.value
      }
      setSettings(map)
      setLoading(false)
    }
    fetchSettings()
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Payment method details — changes save automatically on blur</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--border)]">
                <h2 className="text-sm font-semibold text-[var(--text)]">{method.label}</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                {method.fields.map((field) => (
                  <SettingField
                    key={field.key}
                    fieldKey={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    type={field.type}
                    initialValue={settings[field.key] ?? ''}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
