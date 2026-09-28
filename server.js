/**
 * AIMEX 2026 - Department Fest Registration Backend
 * Standard Node.js REST API & Static Web Server
 * Zero external dependencies required (uses built-in http, fs, path, url).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGS_FILE = path.join(DATA_DIR, 'registrations.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(REGS_FILE)) {
  fs.writeFileSync(REGS_FILE, '[]', 'utf8');
}

const CONFIG = {
  college: 'MITS Deemed to be University (MITS)',
  dept: 'Department of Artificial Intelligence and Machine Learning',
  fest: 'AIMEX 2026',
  upiId: 'deptfest@upi',
  payee: 'AIMEX 2026 Dept Fest',
  festDate: '2026-10-30T09:00:00'
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function getEvents() {
  try {
    return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveEvents(data) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getRegistrations() {
  try {
    return JSON.parse(fs.readFileSync(REGS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveRegistrations(data) {
  fs.writeFileSync(REGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, statusCode, data) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(json)
  });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ---- REST API ENDPOINTS ----
  if (pathname.startsWith('/api/')) {
    // GET /api/config
    if (pathname === '/api/config' && method === 'GET') {
      return sendJson(res, 200, CONFIG);
    }

    // GET /api/events
    if (pathname === '/api/events' && method === 'GET') {
      return sendJson(res, 200, getEvents());
    }

    // POST /api/register
    if (pathname === '/api/register' && method === 'POST') {
      const body = await readBody(req);
      if (!body.eventId || !body.name || !body.email || !body.roll) {
        return sendJson(res, 400, { error: 'Missing required fields (eventId, name, email, roll)' });
      }

      const events = getEvents();
      const targetEvent = events.find(e => e.id === body.eventId);
      if (!targetEvent) {
        return sendJson(res, 404, { error: 'Event not found' });
      }

      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const regId = `AIMEX-${code}`;

      const newReg = {
        id: regId,
        eventId: body.eventId,
        eventName: targetEvent.name,
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone || '').trim(),
        roll: String(body.roll).trim().toUpperCase(),
        dept: String(body.dept || ''),
        year: String(body.year || ''),
        size: String(body.size || '1'),
        members: String(body.members || ''),
        extraLabel: String(body.extraLabel || ''),
        extraValue: String(body.extraValue || ''),
        fee: targetEvent.fee,
        utr: '',
        status: 'Payment Pending',
        checkedIn: false,
        checkInTime: null,
        timestamp: new Date().toISOString()
      };

      if (targetEvent.slotsLeft > 0) {
        targetEvent.slotsLeft -= 1;
        saveEvents(events);
      }

      const regs = getRegistrations();
      regs.unshift(newReg);
      saveRegistrations(regs);

      return sendJson(res, 201, {
        success: true,
        registration: newReg,
        message: 'Registration created successfully'
      });
    }

    // POST /api/pay
    if (pathname === '/api/pay' && method === 'POST') {
      const body = await readBody(req);
      if (!body.id || !body.utr) {
        return sendJson(res, 400, { error: 'Registration ID and UTR are required' });
      }

      const regs = getRegistrations();
      const found = regs.find(r => r.id === body.id);
      if (!found) {
        return sendJson(res, 404, { error: 'Registration not found' });
      }

      found.utr = String(body.utr).trim();
      found.status = 'Confirmed (Verified)';
      found.paymentTime = new Date().toISOString();
      saveRegistrations(regs);

      return sendJson(res, 200, {
        success: true,
        registration: found,
        message: 'Payment verified and registration confirmed'
      });
    }

    // GET /api/tickets
    if (pathname.startsWith('/api/tickets') && method === 'GET') {
      const regs = getRegistrations();
      const q = parsedUrl.query;

      if (q.id) {
        const ticket = regs.find(r => r.id === q.id);
        if (!ticket) return sendJson(res, 404, { error: 'Ticket not found' });
        return sendJson(res, 200, { success: true, ticket });
      }

      if (q.roll) {
        const matched = regs.filter(r => r.roll.toUpperCase() === q.roll.trim().toUpperCase());
        return sendJson(res, 200, { success: true, tickets: matched });
      }

      if (q.email) {
        const matched = regs.filter(r => r.email.toLowerCase() === q.email.trim().toLowerCase());
        return sendJson(res, 200, { success: true, tickets: matched });
      }

      return sendJson(res, 200, { success: true, tickets: regs });
    }

    // POST /api/tickets/checkin
    if (pathname === '/api/tickets/checkin' && method === 'POST') {
      const body = await readBody(req);
      if (!body.id) {
        return sendJson(res, 400, { error: 'Ticket ID is required' });
      }

      const regs = getRegistrations();
      const found = regs.find(r => r.id.toUpperCase() === body.id.trim().toUpperCase());
      if (!found) {
        return sendJson(res, 404, { error: 'Ticket ID not found' });
      }

      if (found.checkedIn) {
        return sendJson(res, 200, {
          success: true,
          alreadyIn: true,
          registration: found,
          message: `Already checked in at ${found.checkInTime}`
        });
      }

      found.checkedIn = true;
      found.checkInTime = new Date().toISOString();
      saveRegistrations(regs);

      return sendJson(res, 200, {
        success: true,
        alreadyIn: false,
        registration: found,
        message: 'Participant checked in successfully!'
      });
    }

    // GET /api/admin/registrations
    if (pathname === '/api/admin/registrations' && method === 'GET') {
      let regs = getRegistrations();
      const { eventId, status, search } = parsedUrl.query;

      if (eventId && eventId !== 'all') {
        regs = regs.filter(r => r.eventId === eventId);
      }
      if (status && status !== 'all') {
        regs = regs.filter(r => (r.status || '').toLowerCase().includes(status.toLowerCase()));
      }
      if (search) {
        const s = search.trim().toLowerCase();
        regs = regs.filter(r =>
          (r.name && r.name.toLowerCase().includes(s)) ||
          (r.roll && r.roll.toLowerCase().includes(s)) ||
          (r.email && r.email.toLowerCase().includes(s)) ||
          (r.id && r.id.toLowerCase().includes(s)) ||
          (r.utr && r.utr.toLowerCase().includes(s))
        );
      }

      return sendJson(res, 200, { success: true, count: regs.length, registrations: regs });
    }

    // GET /api/admin/stats
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const regs = getRegistrations();
      const events = getEvents();

      const confirmed = regs.filter(r => (r.status || '').includes('Confirmed'));
      const checkedInCount = regs.filter(r => r.checkedIn).length;
      const totalRevenue = confirmed.reduce((sum, r) => sum + (Number(r.fee) || 0), 0);

      const byEvent = {};
      events.forEach(e => {
        const eRegs = regs.filter(r => r.eventId === e.id);
        byEvent[e.id] = {
          name: e.name,
          count: eRegs.length,
          confirmed: eRegs.filter(r => (r.status || '').includes('Confirmed')).length,
          slotsLeft: e.slotsLeft
        };
      });

      return sendJson(res, 200, {
        totalRegistrations: regs.length,
        confirmedCount: confirmed.length,
        checkedInCount,
        totalRevenue,
        byEvent
      });
    }

    // GET /api/admin/export
    if (pathname === '/api/admin/export' && method === 'GET') {
      const regs = getRegistrations();
      let csv = '"Ticket ID","Event","Participant Name","Email","Phone","Roll Number","Department","Year","Team Size","Team Members","Fee (INR)","Status","UTR Reference","Checked In","Check-in Time","Registered At"\r\n';

      regs.forEach(r => {
        const membersClean = String(r.members || '').replace(/"/g, '""').replace(/[\r\n]+/g, ' | ');
        const nameClean = String(r.name || '').replace(/"/g, '""');
        csv += `"${r.id}","${r.eventName || ''}","${nameClean}","${r.email || ''}","${r.phone || ''}","${r.roll || ''}","${r.dept || ''}","${r.year || ''}","${r.size || '1'}","${membersClean}","${r.fee || 0}","${r.status || ''}","${r.utr || ''}","${r.checkedIn ? 'Yes' : 'No'}","${r.checkInTime || ''}","${r.timestamp || ''}"\r\n`;
      });

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="aimex-2026-registrations.csv"',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(csv);
    }

    return sendJson(res, 404, { error: 'API Endpoint Not Found' });
  }

  // ---- STATIC FILE SERVING ----
  let cleanPath = pathname.replace(/^\/+/, '');
  if (!cleanPath) cleanPath = 'index.html';

  const filePath = path.join(__dirname, cleanPath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AIMEX 2026 Server running at http://0.0.0.0:${PORT}/`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
