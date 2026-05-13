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

  // POST /api/auth/register
  register: async (req, res) => {
    const { username, password, fullName } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Имя пользователя и пароль обязательны'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Пароль должен содержать минимум 6 символов'
      });
    }

    try {
      // Проверка существования пользователя
      const existingUser = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM admins WHERE username = ?', [username], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Пользователь с таким именем уже существует'
        });
      }

      // Хеширование пароля
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Создание администратора
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO admins (username, password, fullName) 
           VALUES (?, ?, ?)`,
          [username, hashedPassword, fullName || username],
          function (err) {
            if (err) reject(err);
            resolve(this.lastID);
          }
        );
      });

      const newAdmin = await new Promise((resolve, reject) => {
        db.get('SELECT id, username, fullName, role FROM admins WHERE id = ?', 
          [result], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
      });

      const token = generateToken(newAdmin);

      res.status(201).json({
        success: true,
        message: 'Администратор успешно зарегистрирован',
        token,
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
          fullName: newAdmin.fullName,
          role: newAdmin.role
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера при регистрации'
      });
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Введите имя пользователя и пароль'
      });
    }

    try {
      const admin = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM admins WHERE username = ?', 
          [username], 
          (err, row) => {
            if (err) reject(err);
            resolve(row);
          }
        );
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: 'Неверное имя пользователя или пароль'
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Неверное имя пользователя или пароль'
        });
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
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера при входе'
      });
    }
  }
};

module.exports = authController;