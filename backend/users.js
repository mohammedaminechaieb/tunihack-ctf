const db = require('./database');

module.exports = {
  createUser({ username, category = 'general', difficulty = 2 }) {
    return new Promise((resolve, reject) => {
      const stmt = `INSERT INTO users (username, category, difficulty, points, joined)
                    VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)`;
      db.run(stmt, [username, category, difficulty], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) return resolve(null); // username exists
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  },

  getUserByName(username) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  },

async addGateCompletion(userId, gateId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT OR IGNORE INTO user_gates (user_id, gate_id)
      VALUES (?, ?)
    `;
    db.run(sql, [userId, gateId], function(err) {
      if (err) return reject(err);
      resolve(this.changes); // returns 1 if inserted, 0 if already exists
    });
  });
},


  getUserGates(userId) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT gate_id FROM user_gates WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.gate_id));
      });
    });
  }
};
