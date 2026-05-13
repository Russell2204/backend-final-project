const db = require('../config/db');

const initDB = () => {
  // Таблица проектов
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      category    TEXT,
      imageUrl    TEXT,
      year        INTEGER,
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Ошибка создания таблицы projects:', err.message);
    } else {
      console.log('✅ Таблица projects готова');
    }
  });

  // Таблица администраторов (для будущей авторизации)
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      fullName    TEXT,
      role        TEXT DEFAULT 'admin',
      createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Ошибка создания таблицы admins:', err.message);
    } else {
      console.log('✅ Таблица admins готова');
    }
  });
};

module.exports = { initDB };