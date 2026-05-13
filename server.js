// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { initDB } = require('./models/Project');

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// ===================== ROUTES =====================
const authRoutes = require('./routes/auth');
const projectsRouter = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

// Подключение роутов
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRouter);
app.use('/api/upload', uploadRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Добро пожаловать в студию дизайна мебели',
    version: '1.0.0'
  });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден'
  });
});

// ===================== INIT =====================
initDB(); // Инициализация базы данных

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🏛️  LUXURY FURNITURE STUDIO'.bold.green);
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📍 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(70) + '\n');
});