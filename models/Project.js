const db = require('../config/db');

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      category    TEXT,
      imageUrl    TEXT,
      year        INTEGER,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      fullName    TEXT,
      role        TEXT DEFAULT 'admin',
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Таблицы projects и admins готовы');
};

module.exports = { initDB, db };
