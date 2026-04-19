'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { approveMessage, rejectMessage } from './actions'

interface GuestMessage {
  id: string
  author_name: string
  message: string
  approved: boolean
  created_at: string
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ approved }: { approved: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
      approved
        ? 'bg-emerald-500/15 text-emerald-400'
        : 'bg-amber-500/15 text-amber-400'
    }`}>
      {approved ? 'Approved' : 'Pending'}
    </span>
  )
}

function MessageRow({
  msg,
  onApprove,
  onReject,
}: {
  msg: GuestMessage
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="px-5 py-4 border-b border-[var(--surface-3)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-medium text-[var(--gold)]">{msg.author_name}</p>
            <StatusBadge approved={msg.approved} />
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed">{msg.message}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">{formatDate(msg.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!msg.approved && (
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await approveMessage(msg.id)
                  onApprove(msg.id)
                })
              }
              className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isPending ? '…' : 'Approve'}
            </button>
          )}
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await rejectMessage(msg.id)
                onReject(msg.id)
              })
            }
            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isPending ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GuestBookAdminView({
  pageId,
  pageTitle,
  pageSlug,
  messages: initialMessages,
}: {
  pageId: string
  pageTitle: string
  pageSlug: string
  messages: GuestMessage[]
}) {
  const [messages, setMessages] = useState(initialMessages)

  function handleApprove(id: string) {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, approved: true } : m))
  }

  function handleReject(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const pending = messages.filter((m) => !m.approved)
  const approved = messages.filter((m) => m.approved)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/pages"
          className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors mb-3 inline-block"
        >
          ← Back to Pages
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Guest Book</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">{pageTitle}</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">No messages yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pending.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] tracking-[0.15em] uppercase mb-3">
                Pending ({pending.length})
              </p>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
                {pending.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] tracking-[0.15em] uppercase mb-3">
                Approved ({approved.length})
              </p>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
                {approved.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
