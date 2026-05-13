const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');

const db = new Database(dbPath, {
  verbose: console.log, // опционально для отладки
});

// Включаем WAL-режим и foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('✅ Успешно подключено к SQLite базе: database.db');

module.exports = db;
