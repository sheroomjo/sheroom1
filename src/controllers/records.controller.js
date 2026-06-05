// src/controllers/records.controller.js
// تحكم السجلات - معالجة الطلبات والاستجابات

const airtableService = require('../services/airtable.service');

class RecordsController {
  /**
   * الحصول على جميع السجلات
   * GET /api/records
   */
  async getAll(req, res) {
    try {
      const { sort, filter, limit } = req.query;
      
      const options = {};
      if (limit) options.pageSize = parseInt(limit);
      
      let records = await airtableService.getAllRecords(options);

      if (filter) {
        records = await airtableService.searchRecords(filter);
      }

      res.json({
        success: true,
        data: records,
        count: records.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * الحصول على سجل واحد
   * GET /api/records/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'معرّف السجل مطلوب'
          }
        });
      }

      const record = await airtableService.getRecord(id);

      res.json({
        success: true,
        data: record,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(404).json({
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: error.message
        }
      });
    }
  }

  /**
   * البحث عن السجلات
   * GET /api/records/search?query=...
   */
  async search(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_QUERY',
            message: 'معاملات البحث مطلوبة'
          }
        });
      }

      const records = await airtableService.searchRecords(query);

      res.json({
        success: true,
        data: records,
        count: records.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in search:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * إنشاء سجل جديد
   * POST /api/records
   */
  async create(req, res) {
    try {
      const fields = req.body;

      if (!fields || Object.keys(fields).length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'EMPTY_FIELDS',
            message: 'يجب توفير البيانات المطلوبة'
          }
        });
      }

      const record = await airtableService.createRecord(fields);

      res.status(201).json({
        success: true,
        data: record,
        message: 'تم إنشاء السجل بنجاح',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * إنشاء سجلات متعددة
   * POST /api/records/bulk
   */
  async createMultiple(req, res) {
    try {
      const records = req.body;

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'يجب توفير مصفوفة من السجلات'
          }
        });
      }

      const createdRecords = await airtableService.createMultipleRecords(records);

      res.status(201).json({
        success: true,
        data: createdRecords,
        count: createdRecords.length,
        message: `تم إنشاء ${createdRecords.length} سجل بنجاح`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in createMultiple:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'BULK_CREATE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * تحديث سجل
   * PUT /api/records/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const fields = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'معرّف السجل مطلوب'
          }
        });
      }

      if (!fields || Object.keys(fields).length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'EMPTY_FIELDS',
            message: 'يجب توفير البيانات المطلوبة'
          }
        });
      }

      const record = await airtableService.updateRecord(id, fields);

      res.json({
        success: true,
        data: record,
        message: 'تم تحديث السجل بنجاح',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in update:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * تحديث سجلات متعددة
   * PUT /api/records/bulk
   */
  async updateMultiple(req, res) {
    try {
      const records = req.body;

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'يجب توفير مصفوفة من السجلات'
          }
        });
      }

      const updatedRecords = await airtableService.updateMultipleRecords(records);

      res.json({
        success: true,
        data: updatedRecords,
        count: updatedRecords.length,
        message: `تم تحديث ${updatedRecords.length} سجل بنجاح`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in updateMultiple:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'BULK_UPDATE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * حذف سجل
   * DELETE /api/records/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'معرّف السجل مطلوب'
          }
        });
      }

      const result = await airtableService.deleteRecord(id);

      res.json({
        success: true,
        data: result,
        message: 'تم حذف السجل بنجاح',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * حذف سجلات متعددة
   * DELETE /api/records/bulk
   */
  async deleteMultiple(req, res) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'يجب توفير مصفوفة من معرّفات السجلات'
          }
        });
      }

      const deletedRecords = await airtableService.deleteMultipleRecords(ids);

      res.json({
        success: true,
        data: deletedRecords,
        count: deletedRecords.length,
        message: `تم حذف ${deletedRecords.length} سجل بنجاح`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in deleteMultiple:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'BULK_DELETE_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
   * الحصول على إحصائيات
   * GET /api/records/stats
   */
  async getStats(req, res) {
    try {
      const totalRecords = await airtableService.countRecords();

      res.json({
        success: true,
        data: {
          total: totalRecords,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = new RecordsController();