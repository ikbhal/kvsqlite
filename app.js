const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3064;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('keyvaluestore.db');

// Define your API endpoints
app.post('/set', (req, res) => {
  const { key, value } = req.body;
  console.log( )
  db.run('INSERT OR REPLACE INTO kvstore (key, value) VALUES (?, ?)', [key, value], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Key-value pair set successfully' });
    }
  });
});

app.get('/get/:key', (req, res) => {
  const { key } = req.params;
  db.get('SELECT value FROM kvstore WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (row) {
      res.json({ value: row.value });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  });
});

app.get('/keys', (req, res) => {
  db.all('SELECT key FROM kvstore', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const keys = rows.map(row => row.key);
      res.json({ keys });
    }
  });
});

app.delete('/delete/:key', (req, res) => {
  const keyToDelete = req.params.key;

  // Assuming "db" is your SQLite database connection
  db.run('DELETE FROM kvstore WHERE key = ?', [keyToDelete], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Key deleted successfully' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
