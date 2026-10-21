# BrightSmile Dental Clinic — Website Template

An original, professional single-page dental clinic website template
(inspired by the structure of typical dental clinic sites — built from
scratch with original code, text, and graphics; no assets copied).

## Pages / Sections

- Sticky header with smooth-scroll navigation + mobile hamburger menu
- Hero with appointment CTA
- Trust strip (qualified doctors, modern equipment, emergency help, personal approach)
- About the doctor
- Treatments grid (8 services)
- Why choose us + clinic hours panel
- Animated statistics counters
- Testimonial slider (auto-play, arrows, dots)
- Appointment booking form (client-side validation, demo handler)
- Footer with contact details + floating call / WhatsApp / back-to-top buttons

## Run locally

Option 1 — Python:
    cd smile-dental-site
    python -m http.server 8080
    # open http://localhost:8080

Option 2 — Node:
    npx serve smile-dental-site

## Customize

- Replace placeholder contact details (phone, email, address) in `index.html`
- Change clinic name/branding in `index.html` and colors via CSS variables
  at the top of `css/style.css`
- Connect the appointment form to a backend (e.g., PHP mail, Formspree)
  by changing the submit handler in `js/main.js`
