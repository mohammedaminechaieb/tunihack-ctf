const express = require('express');
const app = express();

app.get('/view', (req, res) => {
  const file = req.query.file;
  try {
    res.send(require('fs').readFileSync(file, 'utf8'));
  } catch {
    res.send("Access denied");
  }
});

app.listen(4001);
