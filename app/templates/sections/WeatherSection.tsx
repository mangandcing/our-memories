'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'

interface WeatherData {
  code: number
  maxTemp: number
  minTemp: number
  date: string
}

interface CacheEntry {
  data: WeatherData
  fetchedAt: number
}

const CACHE_TTL = 6 * 60 * 60 * 1000

const YANGON = { lat: 16.8661, lon: 96.1951 }

function wmoLabel(code: number): string {
  if (code === 0) return 'Clear Sky'
  if (code <= 3) return code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast'
  if (code <= 48) return 'Foggy'
  if (code <= 55) return 'Drizzle'
  if (code <= 65) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain Showers'
  if (code <= 86) return 'Snow Showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Cloudy'
}

function WeatherIcon({ code, color }: { code: number; color: string }) {
  const s = { stroke: color, fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (code === 0) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    )
  }
  if (code <= 3) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" {...s}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    )
  }
  if (code <= 65 || (code >= 80 && code <= 82)) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" {...s}>
        <line x1="8" y1="19" x2="8" y2="21" />
        <line x1="8" y1="13" x2="8" y2="15" />
        <line x1="16" y1="19" x2="16" y2="21" />
        <line x1="16" y1="13" x2="16" y2="15" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="12" y1="15" x2="12" y2="17" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      </svg>
    )
  }
  if (code >= 95) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" {...s}>
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
        <polyline points="13 11 9 17 15 17 11 23" />
      </svg>
    )
  }
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" {...s}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

async function geocode(venueName?: string, venueAddress?: string): Promise<{ lat: number; lon: number }> {
  const query = [venueName, venueAddress].filter(Boolean).join(', ')
  if (!query) return YANGON
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
    )
    const json = await res.json()
    const r = json?.results?.[0]
    if (r?.latitude && r?.longitude) return { lat: r.latitude, lon: r.longitude }
  } catch {
    // fall through
  }
  return YANGON
}

async function fetchWeather(lat: number, lon: number, date: string): Promise<WeatherData | null> {
  const today = new Date().toISOString().slice(0, 10)
  const isPast = date < today
  const base = isPast
    ? 'https://archive-api.open-meteo.com/v1/archive'
    : 'https://api.open-meteo.com/v1/forecast'
  try {
    const res = await fetch(
      `${base}?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${date}&end_date=${date}`
    )
    const json = await res.json()
    const d = json?.daily
    if (!d?.weathercode?.[0] === undefined) return null
    return {
      code: d.weathercode[0] as number,
      maxTemp: Math.round(d.temperature_2m_max[0] as number),
      minTemp: Math.round(d.temperature_2m_min[0] as number),
      date,
    }
  } catch {
    return null
  }
}

function WeatherSectionContent({ page, theme }: SectionProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [tooFar, setTooFar] = useState(false)
  const [loading, setLoading] = useState(true)

  const eventDate = page.content.eventDate as string | undefined

  useEffect(() => {
    if (!eventDate) { setLoading(false); return }

    const today = new Date()
    const event = new Date(eventDate)
    const diffDays = Math.floor((event.getTime() - today.getTime()) / 86400000)

    if (diffDays > 16) { setTooFar(true); setLoading(false); return }

    const cacheKey = `weather-${page.id}-${eventDate}`
    try {
      const raw = localStorage.getItem(cacheKey)
      if (raw) {
        const entry: CacheEntry = JSON.parse(raw)
        if (Date.now() - entry.fetchedAt < CACHE_TTL) {
          setWeather(entry.data)
          setLoading(false)
          return
        }
      }
    } catch {
      // ignore
    }

    ;(async () => {
      const coords = await geocode(
        page.content.venueName as string | undefined,
        page.content.venueAddress as string | undefined
      )
      const data = await fetchWeather(coords.lat, coords.lon, eventDate)
      if (data) {
        setWeather(data)
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data, fetchedAt: Date.now() }))
        } catch {
          // ignore
        }
      }
      setLoading(false)
    })()
  }, [eventDate, page.id, page.content.venueName, page.content.venueAddress])

  if (!eventDate || (!loading && !weather && !tooFar)) return null

  const displayDate = eventDate
    ? new Date(eventDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <section className="py-16 px-6" style={{ background: theme.background }}>
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="rounded-2xl px-8 py-7 relative overflow-hidden"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.divider}`,
            }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-5"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              Weather · {displayDate}
            </p>

            {loading && (
              <div className="flex items-center gap-3" style={{ color: theme.subtext }}>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: theme.accent }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-xs" style={{ fontFamily: theme.font }}>Loading forecast&hellip;</span>
              </div>
            )}

            {tooFar && !loading && (
              <p className="text-sm" style={{ color: theme.subtext, fontFamily: theme.font }}>
                Forecast available closer to the date
              </p>
            )}

            {weather && !loading && (
              <div className="flex items-center gap-5">
                <WeatherIcon code={weather.code} color={theme.accent} />
                <div>
                  <p
                    className="text-3xl font-light leading-none mb-1"
                    style={{ color: theme.text, fontFamily: theme.headingFont }}
                  >
                    {weather.maxTemp}°<span className="text-lg">C</span>
                  </p>
                  <p className="text-xs" style={{ color: theme.subtext, fontFamily: theme.font }}>
                    {wmoLabel(weather.code)} · Low {weather.minTemp}°C
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function WeatherSection(props: SectionProps) {
  if (props.tierName === 'basic') return null
  if (!props.page.content.eventDate) return null
  return <WeatherSectionContent {...props} />
}
