// src/index.js
// ملف البداية الرئيسي للتطبيق

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// استيراد المسارات
const recordsRoutes = require('./routes/records.routes');

// استيراد الخدمات
const { testConnection } = require('./integrations/airtable');

// إنشاء تطبيق Express
const app = express();

// ============================================
// Middleware
// ============================================

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: JSON.parse(process.env.CORS_CREDENTIALS || 'true')
}));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Status
 */
app.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    version: process.env.npm_package_version || '1.0.0-alpha',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 */
app.use('/api/records', recordsRoutes);

// ============================================
// Error Handling
// ============================================

/**
 * 404 Not Found
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'الموارد المطلوبة غير موجودة',
      path: req.path,
      method: req.method
    }
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'حدث خطأ داخلي في الخادم'
    }
  });
});

// ============================================
// Server Start
// ============================================

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

/**
 * دالة بدء الخادم
 */
async function startServer() {
  try {
    // اختبار الاتصال بـ Airtable
    console.log('🔍 جاري التحقق من الاتصال بـ Airtable...');
    const isConnected = await testConnection();

    if (isConnected) {
      console.log('✅ تم الاتصال بـ Airtable بنجاح');
    } else {
      console.warn('⚠️ تحذير: فشل الاتصال بـ Airtable');
    }

    // بدء الخادم
    app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════╗
║      🚀 SHE ROOM JO API بدأ العمل      ║
╠════════════════════════════════════════╣
║ 🌐 الموقع: http://${HOST}:${PORT}
║ 📝 البيئة: ${process.env.NODE_ENV || 'development'}
║ 📚 الإصدار: 1.0.0-alpha
║ 📊 الحالة: جاهز للخدمة
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ خطأ في بدء الخادم:', error.message);
    process.exit(1);
  }
}

// بدء الخادم
if (require.main === module) {
  startServer();
}

module.exports = app;