const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

// POST /api/upload — одиночная загрузка
router.post('/', upload.single('image'), uploadImage);

module.exports = router;