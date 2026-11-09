# ส่งต่อความไว้ใจ — ISUZU 70 Trust Passport (iPhone prototype)

Clickable iPhone prototype of the **Trust Passport** feature inside my-ISUZU, built for the
Tri Petch Group Awakens Your Challenge 2026 (After-Sales Service) plan *“ISUZU 70 — Trust Kilometres”*.

UI is in Thai and uses ISUZU CI (red / black / white). **All people, plates, centres, prices and
numbers are illustrative sample data.**

## Screens

| # | Route | Screen | Plan reference |
|---|-------|--------|----------------|
| 1 | `#/home` | my-ISUZU home: vehicle, passport teaser, free-check eligibility, twin-truck auction | Pillar 1–2 |
| 2 | `#/passport` | Trust Passport: verified-mileage timeline (only goes up), stamp book, service history | Pillar 1 |
| 3 | `#/book` → `/2` → `/3` → `/done` | Book the free 70-point / 20-min G-IDSS check (eligibility, centre, Songkran slots with daily cap, PDPA consent, LINE confirmation) | Pilot via LINE |
| 4 | `#/result` | Check result, 2-option quote (genuine ISUZU / Tri Petch), 0% instalments, stamp animation | Revenue driver |
| 5 | `#/transfer` → `/2` → `/3` | “ส่งต่อความไว้ใจ”: choose what buyer sees, QR valid 24 h, buyer joins my-MEMBER | Pillar 1 |
| 6 | `#/scan` → `/good` · `/rolled` | Buyer pre-purchase scan; rolled-back odometer gets auto-flagged | Used-car buyers |
| 7 | `#/handover` | “ส่งกุญแจ ส่งความไว้ใจ” handover ceremony with parent's note on the last page | Next generation |
| 8 | `#/million` | Million-km Moment for Teletec trucks (switch vehicle on home to ELF) | Pillar 2 |
| 9 | `#/odometer` | Trust Odometer (~3 billion km ≈ 10 Earth–Sun round trips) | Buzz driver |
| 10 | `#/rewards` | my-MEMBER points earned from the passport | Loyalty |

On a desktop the app shows inside an iPhone frame with a screen list beside it, which is handy for
screenshots in PDF page 3. On a phone it fills the screen.

## Open it on an iPhone

No build step. It is plain HTML/CSS/JS.

**Same Wi-Fi (keeps it private):**
```bash
python3 -m http.server 8000
# on the iPhone, open http://<your-computer-ip>:8000 in Safari
```
Then Safari → Share → **Add to Home Screen** to launch it full-screen with its own icon.

**Hosted:** any static host (Netlify Drop, Vercel, GitHub Pages) works. Note the competition rule
against posting the idea publicly before results: a public URL counts, so prefer password-protected
or local hosting.

## Files

- `index.html` – shell, iOS web-app meta tags, phone frame
- `styles.css` – CI tokens (`--isuzu-red` etc.) and all components
- `app.js` – sample data, screens, hash router, interactions
- `manifest.webmanifest`, `icons/` – home-screen icon

Before final use, check the `--isuzu-red` value and typefaces against the official ISUZU CI manual.
