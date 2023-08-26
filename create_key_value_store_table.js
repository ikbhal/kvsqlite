const sqlite3 = require('sqlite3').verbose();

const dbFilePath = 'keyvaluestore.db';
const db = new sqlite3.Database(dbFilePath);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS kvstore (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`;

db.run(createTableQuery, err => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created or already exists');
  }

  db.close();
});
