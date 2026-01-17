const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'ctf.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('DB connection error:', err.message);
  else console.log('✅ Connected to SQLite DB');
});

// ---- Load and execute SQL script ----
const sqlFilePath = path.join(__dirname, 'ctf.sql'); // your saved SQL file
fs.readFile(sqlFilePath, 'utf8', (err, sql) => {
  if (err) {
    console.error('Error reading SQL file:', err.message);
    return;
  }

  db.exec(sql, (err) => {
    if (err) console.error('Error executing SQL script:', err.message);
    else console.log('✅ Database initialized from SQL script');
  });
});

module.exports = db;
