const db = require('../config/db');

// Promise-обёртки для удобства
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const projectController = {

  // GET /api/projects — получить все проекты
  getAll: async (req, res) => {
    try {
      const projects = await all(
        'SELECT * FROM projects ORDER BY createdAt DESC'
      );
      res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  },

  // GET /api/projects/:id — получить один проект
  getById: async (req, res) => {
    try {
      const project = await get(
        'SELECT * FROM projects WHERE id = ?',
        [req.params.id]
      );

      if (!project) {
        return res.status(404).json({ success: false, error: 'Проект не найден' });
      }

      res.json({ success: true, data: project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  },

  // POST /api/projects — создать проект
  create: async (req, res) => {
    const { title, description, category, imageUrl, year } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Поле title обязательно' });
    }

    try {
      const result = await run(
        `INSERT INTO projects (title, description, category, imageUrl, year)
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, category, imageUrl, year]
      );

      const newProject = await get('SELECT * FROM projects WHERE id = ?', [result.lastID]);

      res.status(201).json({
        success: true,
        message: 'Проект успешно создан',
        data: newProject
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка при создании проекта' });
    }
  },

  // PUT /api/projects/:id — обновить проект
  update: async (req, res) => {
    const { title, description, category, imageUrl, year } = req.body;
    const { id } = req.params;

    try {
      const result = await run(
        `UPDATE projects 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             category = COALESCE(?, category),
             imageUrl = COALESCE(?, imageUrl),
             year = COALESCE(?, year)
         WHERE id = ?`,
        [title, description, category, imageUrl, year, id]
      );

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Проект не найден' });
      }

      const updatedProject = await get('SELECT * FROM projects WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Проект успешно обновлён',
        data: updatedProject
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка при обновлении проекта' });
    }
  },

  // DELETE /api/projects/:id — удалить проект
  delete: async (req, res) => {
    try {
      const result = await run('DELETE FROM projects WHERE id = ?', [req.params.id]);

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Проект не найден' });
      }

      res.json({ success: true, message: 'Проект успешно удалён' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка при удалении проекта' });
    }
  }
};

module.exports = projectController;