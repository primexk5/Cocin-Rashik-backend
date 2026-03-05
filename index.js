const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// ── Security headers ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow /uploads images
}));

// ── CORS – only allow your known frontend origins ─────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Global rate limiter (max 100 req / 15 min per IP) ─────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});
app.use(globalLimiter);

// ── Stricter limiter on login ─────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

// ── Body parsers with size limits ────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Serve uploaded files statically ──────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────
const announcementRoutes = require('./routes/AnnouncementRoutes');
const sermonRoutes = require('./routes/SermonRoutes');
const projectRoutes = require('./routes/ProjectRoutes');
const updateRoutes = require('./routes/UpdateRoutes');
const progressUpdateRoutes = require('./routes/ProgressUpdateRoutes');

app.use('/announcements', announcementRoutes);
app.use('/announcements/admin/login', loginLimiter); // extra throttle on the login endpoint
app.use('/sermons', sermonRoutes);
app.use('/projects', projectRoutes);
app.use('/updates', updateRoutes);
app.use('/progress-updates', progressUpdateRoutes);

// ── Global error handler (never leak stack traces to client) ──────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[ERROR] ${err.message}`);
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

module.exports = app;
