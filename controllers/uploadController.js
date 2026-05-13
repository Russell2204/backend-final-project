const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadController = {

  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'Файл не загружен' 
        });
      }

      // Загрузка в Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: 'furniture-studio/projects',
          resource_type: 'auto',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            return res.status(500).json({ 
              success: false, 
              error: 'Ошибка загрузки на Cloudinary' 
            });
          }

          res.json({
            success: true,
            message: 'Изображение успешно загружено',
            secure_url: result.secure_url,
            public_id: result.public_id,
            url: result.secure_url
          });
        }
      );

      // Передаём буфер файла в stream
      result.end(req.file.buffer);

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Внутренняя ошибка сервера при загрузке' 
      });
    }
  }
};

module.exports = uploadController;
