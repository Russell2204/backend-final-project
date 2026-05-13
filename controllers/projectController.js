const db = require('../config/db');

const projectController = {

  getAll: (req, res) => {
    try {
      const projects = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
      res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  },

  getById: (req, res) => {
    try {
      const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
      if (!project) return res.status(404).json({ success: false, error: 'Проект не найден' });
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Ошибка сервера' });
    }
  },

  create: (req, res) => {
    const { title, description, category, imageUrl, year } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Поле title обязательно' });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO projects (title, description, category, imageUrl, year)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(title, description, category, imageUrl, year || new Date().getFullYear());
      
      const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({
        success: true,
        message: 'Проект создан',
        data: newProject
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Ошибка при создании' });
    }
  },

  update: (req, res) => {
    const { title, description, category, imageUrl, year } = req.body;
    const { id } = req.params;

    try {
      const stmt = db.prepare(`
        UPDATE projects 
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            category = COALESCE(?, category),
            imageUrl = COALESCE(?, imageUrl),
            year = COALESCE(?, year)
        WHERE id = ?
      `);
      
      const result = stmt.run(title, description, category, imageUrl, year, id);

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Проект не найден' });
      }

      const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
      res.json({ success: true, message: 'Проект обновлён', data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Ошибка обновления' });
    }
  },

  delete: (req, res) => {
    try {
      const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
      
      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Проект не найден' });
      }

      res.json({ success: true, message: 'Проект удалён' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Ошибка удаления' });
    }
  }
};

module.exports = projectController;
