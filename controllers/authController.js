const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (admin) => {
  return jwt.sign(
    { 
      id: admin.id, 
      username: admin.username,
      fullName: admin.fullName,
      role: admin.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authController = {

  register: async (req, res) => {
    const { username, password, fullName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Имя пользователя и пароль обязательны' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Пароль должен содержать минимум 6 символов' });
    }

    try {
      // Проверка существования
      const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);
      if (existing) {
        return res.status(409).json({ success: false, error: 'Пользователь уже существует' });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const stmt = db.prepare(`
        INSERT INTO admins (username, password, fullName) 
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(username, hashedPassword, fullName || username);
      
      const newAdmin = db.prepare('SELECT id, username, fullName, role FROM admins WHERE id = ?')
                        .get(result.lastInsertRowid);

      const token = generateToken(newAdmin);

      res.status(201).json({
        success: true,
        message: 'Администратор успешно зарегистрирован',
        token,
        admin: newAdmin
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Введите имя пользователя и пароль' });
    }

    try {
      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ success: false, error: 'Неверные данные' });
      }

      const token = generateToken(admin);

      res.json({
        success: true,
        message: 'Успешный вход',
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          role: admin.role
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  }
};

module.exports = authController;
