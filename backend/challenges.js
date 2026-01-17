const db = require('./database');

module.exports = {
  getChallenges() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT id, name, category, description, resource_url FROM challenges ORDER BY id`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getFlag(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT flag FROM challenges WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row?.flag);
      });
    });
  }
};
