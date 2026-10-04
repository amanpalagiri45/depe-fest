# AIMEX 2026 – Department Fest Registration & Experience Portal

A modern, responsive event registration platform and tech fest portal built with vanilla HTML, CSS, and JavaScript. Features real-time search and category filtering, live countdown timer, interactive schedule timeline, prize pool & rulebook modal, UPI payment integration, check-in QR codes, celebration confetti, and browser-based ticket management.

## ✨ New & Key Features

- **Live Countdown Timer** – Real-time countdown clock (Days, Hours, Minutes, Seconds) ticking down to fest kickoff on October 10, 2026.
- **Search & Category Filtering** – Instant keyword search (by event name, description, venue) and category filter pills (`Coding & Hackathon`, `Esports`, `Tech Quiz`, `UI/UX Design`).
- **Dual Display Modes (Cards & Schedule)** – Seamless toggle between an Event Card Grid and an hour-by-hour visual Schedule Timeline.
- **Rules, Prize Pools & Coordinators Modal** – Dedicated modal dialog displaying cash prizes (₹25,000+ total pool with Gold/Silver/Bronze tiers), official rulebooks, rounds, and direct phone links to student leads.
- **Urgency & Availability Badges** – Dynamic spots-remaining alerts ("🔥 Only 4 slots left").
- **Dark / Light Mode Toggle** – Manual Sun ☀️ / Moon 🌙 toggle in the navbar with persistent preference saved to local storage.
- **Celebration Confetti** – Lightweight HTML5 canvas particle celebration burst upon successful payment confirmation.
- **Digital Tickets & QR Check-in** – Auto-generated registration pass with dynamic check-in QR code, 1-click **Copy Ticket ID**, and **Print / Save as PDF** styling.
- **UPI Payment Workflow** – Dynamic QR code generation for Google Pay, PhonePe, and Paytm with transaction reference (UTR) verification.
- **100% Client-Side & Zero-Backend Dependency** – Stores registrations in browser `localStorage`. Ready for instant deployment on GitHub Pages, Vercel, or Netlify.

## 📁 Project Structure

```
aimex-fest/
├── index.html      # Accessible structure, countdown, modal & views
├── styles.css      # Modern styling, dark/light themes, animations & print styles
├── app.js          # Application logic, countdown, search/filter, UPI QR & tickets
├── package.json    # Project metadata
└── README.md       # Documentation
```

## 🚀 Quick Start

1. **Open directly in browser**:
   Simply double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

2. **Or run with a local web server**:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node (if installed)
   npx serve
   ```
   Then visit `http://localhost:8000`

## ⚙️ Configuration

### Admin Dashboard Access

Copy `.env.example` to `.env`, then set a random `ADMIN_SESSION_SECRET` of at least 32 characters and a unique code for each authorized role. Keep `.env` private and configure the same variables in your hosting provider before deployment. Admin data and CSV export require a valid server-issued session.

Edit the `CONFIG` object at the top of [`app.js`](file:///c:/Users/LENOVO/Desktop/depe%20fest/app.js):

```javascript
const CONFIG = {
  college: 'MITS Deemed to be University (MITS)',
  dept: 'Department of Artificial Intelligence and Machine Learning',
  fest: 'AIMEX 2026',
  upiId: 'deptfest@upi',              // Replace with your fest UPI ID
  payee: 'AIMEX 2026 Dept Fest',
  festDate: '2026-10-10T09:00:00'     // Date for the live countdown
};
```

## 📄 License

MIT – Free to customize and use for your university/college events!
