const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к базе данных
const dbPath = path.resolve(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к SQLite:', err.message);
  } else {
    console.log('✅ Успешно подключено к SQLite базе: database.db');
  }
});

// Включаем foreign keys и WAL-режим для лучшей производительности
db.exec('PRAGMA foreign_keys = ON;', (err) => {
  if (err) console.error('Ошибка PRAGMA:', err);
});

module.exports = db;