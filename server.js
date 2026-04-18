const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const db = new Database(path.join(__dirname, 'signups.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS signups (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    native_lang TEXT    NOT NULL DEFAULT 'en',
    learn_lang  TEXT    NOT NULL DEFAULT 'es',
    platforms   TEXT    NOT NULL DEFAULT '[]',
    goals       TEXT    NOT NULL DEFAULT '[]',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertSignup = db.prepare(`
  INSERT INTO signups (name, email, native_lang, learn_lang, platforms, goals)
  VALUES (@name, @email, @native_lang, @learn_lang, @platforms, @goals)
`);

const countSignups = db.prepare('SELECT COUNT(*) as total FROM signups');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/signup', (req, res) => {
  const { name, email, nativeLang, learnLang, platforms, goals } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!email || !/^.+@.+\..+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    insertSignup.run({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      native_lang: nativeLang || 'en',
      learn_lang: learnLang || 'es',
      platforms: JSON.stringify(Array.isArray(platforms) ? platforms : []),
      goals: JSON.stringify(Array.isArray(goals) ? goals : []),
    });

    const { total } = countSignups.get();
    res.json({ success: true, position: total });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat&Go landing page running at http://localhost:${PORT}`);
});
