/**
 * AIMEX 2026 - Department Fest Registration Backend
 * Standard Node.js REST API & Static Web Server
 * Supports MongoDB when available and falls back to JSON files when offline.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { connectDB, Event, Registration, ensureSeedEvents, mongoose } = require('./db');

const PORT = process.env.PORT || 8000;
const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGS_FILE = path.join(DATA_DIR, 'registrations.json');
const ADMIN_SESSION_COOKIE = 'aimex_admin_session';
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000;
const ADMIN_ROLES = {
  'Club Coordinator': 'ADMIN_CODE_CLUB_COORDINATOR',
  HOD: 'ADMIN_CODE_HOD',
  'Vice President': 'ADMIN_CODE_VICE_PRESIDENT',
  Faculty: 'ADMIN_CODE_FACULTY',
  'Event Committee': 'ADMIN_CODE_EVENT_COMMITTEE'
};
const loginAttempts = new Map();

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

async function getEvents() {
  if (mongoose.connection.readyState === 1) {
    const events = await Event.find().lean();
    return Array.isArray(events) ? events : [];
  }

  try {
    return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

async function saveEvents(data) {
  if (mongoose.connection.readyState === 1) {
    const docs = Array.isArray(data) ? data : [];
    await Promise.all(
      docs.map(item => Event.updateOne({ id: item.id }, { $set: item }, { upsert: true }))
    );
    return;
  }

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function getRegistrations() {
  if (mongoose.connection.readyState === 1) {
    const regs = await Registration.find().sort({ timestamp: -1 }).lean();
    return Array.isArray(regs) ? regs : [];
  }

  try {
    return JSON.parse(fs.readFileSync(REGS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

async function saveRegistrations(data) {
  if (mongoose.connection.readyState === 1) {
    const docs = Array.isArray(data) ? data : [];
    await Promise.all(
      docs.map(item =>
        Registration.updateOne({ id: item.id }, { $set: item }, { upsert: true })
      )
    );
    return;
  }

  fs.writeFileSync(REGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, statusCode, data, extraHeaders = {}) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(json),
    ...extraHeaders
  });
  res.end(json);
}

function adminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return secret.length >= 32 ? secret : null;
}

function signAdminSession(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', adminSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function readAdminSession(req) {
  const secret = adminSessionSecret();
  if (!secret) return null;

  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!cookie) return null;

  const token = cookie.slice(ADMIN_SESSION_COOKIE.length + 1);
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = crypto.createHmac('sha256', secret).update(encoded).digest();
  let actual;
  try {
    actual = Buffer.from(signature, 'base64url');
  } catch (error) {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!ADMIN_ROLES[payload.role] || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function adminCookie(token, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}

function checkAdminLoginLimit(req) {
  const ip = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (!attempts || attempts.resetAt <= now) {
    loginAttempts.set(ip, { count: 0, resetAt: now + 15 * 60 * 1000 });
  }
  const current = loginAttempts.get(ip);
  return current.count < 5 ? current : null;
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

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/admin/login' && method === 'POST') {
      if (!adminSessionSecret()) {
        return sendJson(res, 503, { error: 'Admin authentication is not configured on the server.' });
      }

      const attempt = checkAdminLoginLimit(req);
      if (!attempt) {
        return sendJson(res, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' });
      }

      const body = await readBody(req);
      const envName = ADMIN_ROLES[body.role];
      const expectedCode = envName && process.env[envName];
      const suppliedCode = String(body.accessCode || '');
      const matches = expectedCode && crypto.timingSafeEqual(
        crypto.createHash('sha256').update(suppliedCode).digest(),
        crypto.createHash('sha256').update(expectedCode).digest()
      ) && suppliedCode.length === expectedCode.length;

      if (!matches) {
        attempt.count += 1;
        return sendJson(res, 401, { error: 'Invalid role or access code.' });
      }

      loginAttempts.delete(req.socket.remoteAddress || 'unknown');
      const session = signAdminSession({ role: body.role, expiresAt: Date.now() + ADMIN_SESSION_TTL });
      return sendJson(res, 200, { success: true, role: body.role }, {
        'Set-Cookie': adminCookie(session, ADMIN_SESSION_TTL / 1000)
      });
    }

    if (pathname === '/api/admin/session' && method === 'GET') {
      const session = readAdminSession(req);
      if (!session) return sendJson(res, 401, { error: 'Admin sign-in required.' });
      return sendJson(res, 200, { authorized: true, role: session.role });
    }

    if (pathname === '/api/admin/logout' && method === 'POST') {
      return sendJson(res, 200, { success: true }, { 'Set-Cookie': adminCookie('', 0) });
    }

    if (pathname.startsWith('/api/admin/')) {
      if (!readAdminSession(req)) {
        return sendJson(res, 401, { error: 'Admin sign-in required.' });
      }
    }

    if (pathname === '/api/config' && method === 'GET') {
      return sendJson(res, 200, CONFIG);
    }

    if (pathname === '/api/events' && method === 'GET') {
      return sendJson(res, 200, await getEvents());
    }

    if (pathname === '/api/register' && method === 'POST') {
      const body = await readBody(req);
      if (!body.eventId || !body.name || !body.email || !body.roll) {
        return sendJson(res, 400, { error: 'Missing required fields (eventId, name, email, roll)' });
      }

      const events = await getEvents();
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
        paymentTime: null,
        timestamp: new Date().toISOString()
      };

      if (targetEvent.slotsLeft > 0) {
        targetEvent.slotsLeft -= 1;
        await saveEvents(events);
      }

      if (mongoose.connection.readyState === 1) {
        const created = await Registration.create(newReg);
        return sendJson(res, 201, {
          success: true,
          registration: created.toObject(),
          message: 'Registration created successfully'
        });
      }

      const regs = await getRegistrations();
      regs.unshift(newReg);
      await saveRegistrations(regs);

      return sendJson(res, 201, {
        success: true,
        registration: newReg,
        message: 'Registration created successfully'
      });
    }

    if (pathname === '/api/pay' && method === 'POST') {
      const body = await readBody(req);
      if (!body.id || !body.utr) {
        return sendJson(res, 400, { error: 'Registration ID and UTR are required' });
      }

      if (mongoose.connection.readyState === 1) {
        const found = await Registration.findOne({ id: body.id });
        if (!found) {
          return sendJson(res, 404, { error: 'Registration not found' });
        }

        found.utr = String(body.utr).trim();
        found.status = 'Confirmed (Verified)';
        found.paymentTime = new Date();
        await found.save();

        return sendJson(res, 200, {
          success: true,
          registration: found.toObject(),
          message: 'Payment verified and registration confirmed'
        });
      }

      const regs = await getRegistrations();
      const found = regs.find(r => r.id === body.id);
      if (!found) {
        return sendJson(res, 404, { error: 'Registration not found' });
      }

      found.utr = String(body.utr).trim();
      found.status = 'Confirmed (Verified)';
      found.paymentTime = new Date().toISOString();
      await saveRegistrations(regs);

      return sendJson(res, 200, {
        success: true,
        registration: found,
        message: 'Payment verified and registration confirmed'
      });
    }

    if (pathname.startsWith('/api/tickets') && method === 'GET') {
      const regs = await getRegistrations();
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

      if (!readAdminSession(req)) {
        return sendJson(res, 401, { error: 'Admin sign-in required to list all tickets.' });
      }

      return sendJson(res, 200, { success: true, tickets: regs });
    }

    if (pathname === '/api/tickets/checkin' && method === 'POST') {
      if (!readAdminSession(req)) {
        return sendJson(res, 401, { error: 'Admin sign-in required to check in participants.' });
      }

      const body = await readBody(req);
      if (!body.id) {
        return sendJson(res, 400, { error: 'Ticket ID is required' });
      }

      if (mongoose.connection.readyState === 1) {
        const found = await Registration.findOne({ id: body.id.trim() });
        if (!found) {
          return sendJson(res, 404, { error: 'Ticket ID not found' });
        }

        if (found.checkedIn) {
          return sendJson(res, 200, {
            success: true,
            alreadyIn: true,
            registration: found.toObject(),
            message: `Already checked in at ${found.checkInTime}`
          });
        }

        found.checkedIn = true;
        found.checkInTime = new Date();
        await found.save();

        return sendJson(res, 200, {
          success: true,
          alreadyIn: false,
          registration: found.toObject(),
          message: 'Participant checked in successfully!'
        });
      }

      const regs = await getRegistrations();
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
      await saveRegistrations(regs);

      return sendJson(res, 200, {
        success: true,
        alreadyIn: false,
        registration: found,
        message: 'Participant checked in successfully!'
      });
    }

    if (pathname === '/api/admin/registrations' && method === 'GET') {
      let regs = await getRegistrations();
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

    if (pathname === '/api/admin/stats' && method === 'GET') {
      const regs = await getRegistrations();
      const events = await getEvents();

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

    if (pathname === '/api/admin/export' && method === 'GET') {
      const regs = await getRegistrations();
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

  let cleanPath = pathname.replace(/^\/+/, '');
  if (!cleanPath) cleanPath = 'index.html';

  const filePath = path.join(__dirname, cleanPath);

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

connectDB().then(ensureSeedEvents).finally(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`AIMEX 2026 Server running at http://0.0.0.0:${PORT}/`);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
