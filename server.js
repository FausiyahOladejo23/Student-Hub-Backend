require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const requireAuth = require('./middleware/requireAuth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 5000;

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  console.error('SESSION_SECRET must be set to a random string of at least 32 characters in backend/.env');
  process.exit(1);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

const sessionDays = Math.max(1, Number(process.env.SESSION_MAX_AGE_DAYS) || 7);
app.use(session({
  name: 'studenthub.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions', ttl: sessionDays * 24 * 60 * 60 }),
  cookie: { httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: sessionDays * 24 * 60 * 60 * 1000 }
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' } });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'StudentHub API is running.', environment: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString() }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', requireAuth, require('./routes/assignmentRoutes'));
app.use('/api/goals', requireAuth, require('./routes/goalRoutes'));
app.use('/api/notes', requireAuth, require('./routes/noteRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API endpoint not found.' }));
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    const server = app.listen(port, () => console.log(`StudentHub API listening at http://localhost:${port}`));
    const shutdown = () => server.close(() => process.exit(0));
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}
start();
