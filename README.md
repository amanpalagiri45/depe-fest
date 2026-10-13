# AIMEX 2K26 – Department Fest Registration & Experience Portal

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

1. Install dependencies and start the application server:
   ```bash
   npm install
   npm start
   ```
2. Visit `http://localhost:8000`. Registration, payment confirmation, and admin features require the Node server; opening `index.html` directly will not provide the API.

## ⚙️ Configuration

### Admin Dashboard Access

Copy `.env.example` to `.env`, then set a random `ADMIN_SESSION_SECRET` of at least 32 characters and a unique code for each authorized role. Keep `.env` private and configure the same variables in your hosting provider before deployment. Admin data and CSV export require a valid server-issued session.

The fest name, UPI details, and countdown date are configured in the `CONFIG` object at the top of `app.js`:

```javascript
const CONFIG = {
  college: 'MITS Deemed to be University (MITS)',
  dept: 'Department of Artificial Intelligence and Machine Learning',
  fest: 'AIMEX 2K26',
  upiId: 'deptfest@upi',              // Replace with your fest UPI ID
  payee: 'AIMEX 2K26 Dept Fest',
  festDate: '2026-11-05T09:00:00'     // Date for the live countdown
};
```

### Registration confirmation messages

Confirmation email and WhatsApp template messages are attempted after a participant submits payment details and the registration is confirmed. Configure credentials as server environment variables (copy `.env.example` as a reference); never put provider credentials in `app.js` or commit them.

- Email uses SMTP. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
- WhatsApp uses the Meta WhatsApp Cloud API. Set `WHATSAPP_API_VERSION`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE`. Create and get approval for a utility message template with four body parameters in this order: participant name, event name, ticket ID, and fee. Suggested copy: “Hi {{1}}, your registration for {{2}} has been received. Ticket ID: {{3}}. Registration fee: ₹{{4}}. Payment details may be checked by the event organizers. Please keep your ticket ID for check-in.” WhatsApp is sent only if the participant checks the opt-in box during registration.
- Delivery status is shown on the confirmation page. A provider failure does not undo a saved registration; check the server log and provider configuration if a message is not sent.

The leadership cards on the event page use the names and roles supplied for AIMEX 2K26. Add a separate sponsor section if sponsors are confirmed.

## 📄 License

MIT – Free to customize and use for your university/college events!
