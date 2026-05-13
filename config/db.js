const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null,
});

// Оптимизации SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

console.log('✅ Успешно подключено к SQLite базе: database.db (better-sqlite3)');

module.exports = db;
