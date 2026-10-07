# MeraPaint.in

A colourful React + Vite marketing site for a paint brand, inspired by the layout energy of asianpaints.com but with its own palette, type and copy.

## Run locally
```
npm install
npm run dev
```

## Deploy on Vercel
1. Push this folder to a GitHub repo (or drag-and-drop the folder into vercel.com/new — Vercel accepts a zip/folder upload too).
2. On vercel.com → **Add New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output directory `dist` (Vercel fills these in automatically).
4. Click **Deploy**. Your site goes live at a `*.vercel.app` URL — add `merapaint.in` under Project → Settings → Domains once it's deployed.

## Customize
- Colours & fonts: `src/index.css` (CSS variables at the top).
- Copy, shades, products, testimonials: `src/App.jsx` (plain arrays near the top of the file).
- Replace the CSS-drawn hero "rooms" with real photos by dropping images into `public/` and swapping the relevant `<div>` for an `<img>`.

## Make the contact form actually send you emails
The form works out of the box in "demo mode" — it shows a real success message when submitted, but doesn't send anywhere yet. To receive real emails:
1. Go to https://formspree.io and sign up free (no credit card).
2. Create a new form — it gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
3. Open `src/App.jsx`, find the line `const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'` near the top, and paste your real endpoint in.
4. Redeploy (push to GitHub — Vercel redeploys automatically). Every submission now lands in your inbox.
