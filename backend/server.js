require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');

const connectDB = require('./src/config/db');
require('./auth/passport');

const authRouter = require('./src/Routers/auth.route');
const chatRouter = require('./src/Routers/chat.route');

const app = express();

connectDB();
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
const allowedOrigins = [
  frontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://flashgpt-ai.vercel.app"
];
const isSecureCookie = frontendUrl.startsWith("https://");

// Needed when the API is behind Render/another proxy and uses secure cookies.
app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions"
});

app.use(session({
  name: "connect.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,

  cookie: {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: isSecureCookie ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api', chatRouter);

app.use((req, res, next) => {
  console.log("COOKIE HEADER:", req.headers.cookie);
  console.log("SESSION ID:", req.sessionID);
  console.log("PASSPORT:", req.session.passport);
  next();
});

app.get('/', (req, res) => {
  res.send('Backend Running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
