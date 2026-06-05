// src/routes/records.routes.js
// مسارات السجلات (API Endpoints)

const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/records.controller');

/**
 * GET /api/records
 * الحصول على جميع السجلات
 */
router.get('/', recordsController.getAll.bind(recordsController));

/**
 * GET /api/records/search
 * البحث عن السجلات
 */
router.get('/search', recordsController.search.bind(recordsController));

/**
 * GET /api/records/stats
 * الحصول على الإحصائيات
 */
router.get('/stats', recordsController.getStats.bind(recordsController));

/**
 * GET /api/records/:id
 * الحصول على سجل واحد
 */
router.get('/:id', recordsController.getById.bind(recordsController));

/**
 * POST /api/records
 * إنشاء سجل جديد
 */
router.post('/', recordsController.create.bind(recordsController));

/**
 * POST /api/records/bulk
 * إنشاء سجلات متعددة
 */
router.post('/bulk', recordsController.createMultiple.bind(recordsController));

/**
 * PUT /api/records/:id
 * تحديث سجل
 */
router.put('/:id', recordsController.update.bind(recordsController));

/**
 * PUT /api/records/bulk
 * تحديث سجلات متعددة
 */
router.put('/bulk', recordsController.updateMultiple.bind(recordsController));

/**
 * DELETE /api/records/:id
 * حذف سجل
 */
router.delete('/:id', recordsController.delete.bind(recordsController));

/**
 * DELETE /api/records/bulk
 * حذف سجلات متعددة
 */
router.delete('/bulk', recordsController.deleteMultiple.bind(recordsController));

module.exports = router;