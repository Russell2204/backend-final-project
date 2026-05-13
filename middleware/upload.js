const multer = require('multer');

const fileFilter = (req, file, cb) => {
  // Разрешаем только изображения
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (jpg, jpeg, png, webp)'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(), // Храним в памяти — оптимально для Cloudinary
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;