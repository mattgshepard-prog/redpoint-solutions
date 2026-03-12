# Redpoint Solutions — redpointsolutions.ai

Distressed seller resource site for Redpoint Consulting's wholesale acquisition side. Denver metro focus.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + CSS custom properties
- **Fonts:** Playfair Display + DM Sans (Google Fonts)
- **Email:** Resend (optional — logs to console without it)
- **Deploy:** Vercel via GitHub

## Pages
- `/` — Homepage with hero, 5 situation cards, about section, testimonials, FAQ, contact form
- `/situations/inherited-property` — Inherited/probate guide
- `/situations/divorce` — Divorce property guide  
- `/situations/tax-liens` — Tax lien guide
- `/situations/code-violations` — Code violations guide
- `/situations/forced-move` — Forced move/relocation guide
- `/about` — About page (contractor background, philosophy)
- `/contact` — Contact page with form

## Quick Start
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push to GitHub: `git init && git add -A && git commit -m "initial" && git remote add origin <repo-url> && git push -u origin main`
2. Connect repo in Vercel dashboard
3. Set environment variables in Vercel:
   - `RESEND_API_KEY` (optional)
   - `FROM_EMAIL` (optional)
   - `NOTIFICATION_EMAIL` (optional)
4. Point `redpointsolutions.ai` to Vercel in GoDaddy DNS

## Phase 2 (TODO)
- [ ] AI Situation Assessment survey widget (Gemini-powered)
- [ ] Garry call booking integration (Vapi)
- [ ] Chat widget (live Q&A)
- [ ] LeadStrike integration for lead routing
- [ ] Blog/resource section for SEO
- [ ] Google Analytics / conversion tracking

## Entity
Redpoint Solutions is a division of Redpoint Consulting (M G Enterprises LLC).
Backed by Onsight Construction LLC (licensed GC).
