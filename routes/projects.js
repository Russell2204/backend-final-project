const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Публичные маршруты
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Защищённые маршруты (только для авторизованных)
router.post('/', auth, projectController.create);
router.put('/:id', auth, projectController.update);
router.delete('/:id', auth, projectController.delete);

module.exports = router;