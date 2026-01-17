const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');


const users = require('./users');
const challenges = require('./challenges');

const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session');
app.use(session({
  secret: 'tunihack_secret',
  resave: false,
  saveUninitialized: true
}));


// ---- MIDDLEWARE ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// ---- SERVE FRONTEND ----
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/downloads', express.static(path.join(__dirname, './downloads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/welcome.html'));
});

// ---- SIGNUP ----
app.post('/api/signup', async (req, res) => {
  try {
    const { username, category, difficulty } = req.body;

    if (!username || username.length < 3) {
      return res.json({ success: false, message: 'INVALID USERNAME' });
    }

    // Create user
    const userId = await users.createUser({ username, category, difficulty });
    if (!userId) {
      return res.json({ success: false, message: 'USERNAME EXISTS' });
    }

    // Store userId in session (optional)
    req.session.userId = userId;

    // Signup successful
    res.json({ success: true });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: 'SERVER ERROR' });
  }
});

// ---- GET CHALLENGES ----
app.get('/api/challenges', async (req, res) => {
  res.json(await challenges.getChallenges());
});

// ---- GATE STATUS ----
app.get('/api/gates-status/:username', async (req, res) => {
  const user = await users.getUserByName(req.params.username);
  if (!user) return res.json([]);

  const gates = await users.getUserGates(user.id);
  res.json(gates.map(g => ({ gateId: g })));
});

// ---- SUBMIT FLAG ----
app.post('/api/submit-flag', async (req, res) => {
  const { name, gateId, flag } = req.body;

  if (!name || !gateId || !flag) {
    return res.json({ success: false });
  }

  const correct = await challenges.getFlag(gateId);
  if (!correct || flag !== correct) {
    return res.json({ success: false });
  }

  const user = await users.getUserByName(name);
  if (user) {
    // Add gate to user_gates to keep it unlocked (ignores duplicates)
    await users.addGateCompletion(user.id, gateId);
  }

  // Return success and optional message
  res.json({ success: true, message: "Gate unlocked and recorded!" });
});


// ---- LEADERBOARD ----
app.get('/api/leaderboard', (req, res) => {
  const query = `
  SELECT u.username, u.category, COUNT(ug.gate_id) AS score
  FROM users u
  LEFT JOIN user_gates ug ON u.id = ug.user_id
  GROUP BY u.id
  ORDER BY score DESC, u.username ASC
`;


  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Leaderboard DB error:', err.message);
      return res.status(500).json({ error: 'DB connection failed' });
    }

    res.json(rows);
  });
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`🔥 TUNIHACK LIVE on port ${PORT}`);
});
