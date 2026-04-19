# Our Memories — our-memories.store

## What This Project Is
A premium digital platform where people create beautiful cinematic pages to celebrate life moments (weddings, birthdays, memorials, etc). Pages are shared via link or QR code.

## Target Market
Myanmar (primary), international later. Supports Burmese and English.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database, auth, file storage)
- Framer Motion (animations)

## Authentication
- Google OAuth ONLY — no username/password system

## Page Types (10 total)
Wedding Celebration, Birthday Wish, Wedding Invitation, Anniversary, Memorial & Tribute, Love Letter, Gender Reveal, Birthday Invitation, Ceremony Invitation, Custom Page

## Pricing Tiers (3 total)
- Basic — text content, gift section, 10 templates
- Premium — Basic + photos, music, countdown, PDF export
- Luxury — Premium + video, interactive games, collaboration, custom domain

## Templates (30 total)
- ONE shared data-driven renderer — never separate code per template
- 10 Basic templates, 10 Premium templates, 10 Luxury templates

## Payment Flow
- Manual only — no payment gateway
- Customer uploads payment screenshot
- Admin reviews and approves manually
- Supported: KBZ Pay, Wave Money, AYA Pay, Bangkok Bank QR, True Money

## Admin Portal
- Manages ALL pricing (stored in Supabase, never hardcoded)
- Reviews payments and content
- Manages templates, RSVPs, discount codes
- Receives Telegram alerts for: new payment, review submission, RSVP, resubmission

## Key Rules for Claude
- Never hardcode any prices — all prices come from Supabase
- Always reuse existing components, never create duplicates
- Templates use ONE shared renderer, not separate files per template
- Ask before creating new files
- No code comments unless asked
- Keep responses concise — no long explanations unless asked