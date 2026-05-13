require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { initDB } = require('./models/Project');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Инициализация базы данных
initDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Добро пожаловать в студию дизайна премиальной мебели ✨',
    status: 'success',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// Production — обслуживание React фронтенда
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📁 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log('✨ Luxury Furniture Studio Backend готов к работе\n');
});

module.exports = app;
