const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aimex2026';

mongoose.set('strictQuery', false);

const EventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: String,
    tag: String,
    category: String,
    desc: String,
    date: String,
    venue: String,
    fee: Number,
    min: Number,
    max: Number,
    c: String,
    on: String,
    slotsLeft: Number,
    prizes: Array,
    rules: Array,
    coordinators: Array,
    extra: Object
  },
  { collection: 'events', timestamps: true }
);

const RegistrationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    eventId: String,
    eventName: String,
    name: String,
    email: String,
    phone: String,
    roll: String,
    dept: String,
    year: String,
    size: String,
    members: String,
    extraLabel: String,
    extraValue: String,
    fee: Number,
    utr: String,
    status: String,
    checkedIn: { type: Boolean, default: false },
    checkInTime: { type: Date, default: null },
    paymentTime: { type: Date, default: null },
    timestamp: { type: Date, default: Date.now }
  },
  { collection: 'registrations', timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const Registration =
  mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return true;

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.warn('MongoDB unavailable, using local JSON fallback.');
    console.warn(error.message);
    return false;
  }
}

async function ensureSeedEvents() {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const count = await Event.countDocuments();
    if (count > 0) return;

    if (fs.existsSync(EVENTS_FILE)) {
      const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
      if (Array.isArray(events) && events.length > 0) {
        await Event.insertMany(events);
      }
    }
  } catch (error) {
    console.warn('Could not seed MongoDB events:', error.message);
  }
}

module.exports = {
  mongoose,
  Event,
  Registration,
  connectDB,
  ensureSeedEvents,
  mongoUri
};
