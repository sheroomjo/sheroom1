// src/services/airtable.service.js
// خدمة Airtable - العمليات الأساسية

const { getTable } = require('../integrations/airtable');

class AirtableService {
  /**
   * الحصول على جميع السجلات
   * @param {Object} options - خيارات البحث
   * @returns {Promise<Array>}
   */
  async getAllRecords(options = {}) {
    try {
      const records = [];
      const selectOptions = {
        ...options,
        pageSize: options.pageSize || 100
      };

      await getTable()
        .select(selectOptions)
        .eachPage((pageRecords, nextPage) => {
          records.push(...pageRecords);
          nextPage();
        });

      return records;
    } catch (error) {
      throw new Error(`فشل جلب السجلات: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل واحد
   * @param {string} recordId - معرّف السجل
   * @returns {Promise<Object>}
   */
  async getRecord(recordId) {
    try {
      const record = await getTable().find(recordId);
      return record;
    } catch (error) {
      throw new Error(`فشل جلب السجل: ${error.message}`);
    }
  }

  /**
   * البحث عن السجلات
   * @param {string} filterByFormula - صيغة البحث
   * @returns {Promise<Array>}
   */
  async searchRecords(filterByFormula) {
    try {
      const records = [];
      await getTable()
        .select({
          filterByFormula: filterByFormula,
          pageSize: 100
        })
        .eachPage((pageRecords, nextPage) => {
          records.push(...pageRecords);
          nextPage();
        });

      return records;
    } catch (error) {
      throw new Error(`فشل البحث عن السجلات: ${error.message}`);
    }
  }

  /**
   * إنشاء سجل جديد
   * @param {Object} fields - حقول السجل
   * @returns {Promise<Object>}
   */
  async createRecord(fields) {
    try {
      if (!fields || typeof fields !== 'object') {
        throw new Error('يجب أن تكون البيانات من نوع object');
      }

      const record = await getTable().create(fields);
      return record;
    } catch (error) {
      throw new Error(`فشل إنشاء السجل: ${error.message}`);
    }
  }

  /**
   * إنشاء سجلات متعددة
   * @param {Array} records - قائمة السجلات
   * @returns {Promise<Array>}
   */
  async createMultipleRecords(records) {
    try {
      if (!Array.isArray(records)) {
        throw new Error('يجب أن تكون البيانات من نوع array');
      }

      const createdRecords = [];
      
      for (let i = 0; i < records.length; i += 10) {
        const batch = records.slice(i, i + 10);
        const batchResults = await getTable().create(batch);
        createdRecords.push(...batchResults);
      }

      return createdRecords;
    } catch (error) {
      throw new Error(`فشل إنشاء السجلات: ${error.message}`);
    }
  }

  /**
   * تحديث سجل
   * @param {string} recordId - معرّف السجل
   * @param {Object} fields - الحقول المراد تحديثها
   * @returns {Promise<Object>}
   */
  async updateRecord(recordId, fields) {
    try {
      if (!recordId) {
        throw new Error('معرّف السجل مطلوب');
      }

      const record = await getTable().update(recordId, fields);
      return record;
    } catch (error) {
      throw new Error(`فشل تحديث السجل: ${error.message}`);
    }
  }

  /**
   * تحديث سجلات متعددة
   * @param {Array} records - قائمة السجلات مع معرّفاتها
   * @returns {Promise<Array>}
   */
  async updateMultipleRecords(records) {
    try {
      if (!Array.isArray(records)) {
        throw new Error('يجب أن تكون البيانات من نوع array');
      }

      const updatedRecords = [];
      
      for (let i = 0; i < records.length; i += 10) {
        const batch = records.slice(i, i + 10);
        const batchResults = await getTable().update(batch);
        updatedRecords.push(...batchResults);
      }

      return updatedRecords;
    } catch (error) {
      throw new Error(`فشل تحديث السجلات: ${error.message}`);
    }
  }

  /**
   * حذف سجل
   * @param {string} recordId - معرّف السجل
   * @returns {Promise<Object>}
   */
  async deleteRecord(recordId) {
    try {
      if (!recordId) {
        throw new Error('معرّف السجل مطلوب');
      }

      await getTable().destroy(recordId);
      return { success: true, id: recordId };
    } catch (error) {
      throw new Error(`فشل حذف السجل: ${error.message}`);
    }
  }

  /**
   * حذف سجلات متعددة
   * @param {Array} recordIds - قائمة معرّفات السجلات
   * @returns {Promise<Array>}
   */
  async deleteMultipleRecords(recordIds) {
    try {
      if (!Array.isArray(recordIds)) {
        throw new Error('يجب أن تكون البيانات من نوع array');
      }

      const deletedRecords = [];
      
      for (let i = 0; i < recordIds.length; i += 10) {
        const batch = recordIds.slice(i, i + 10);
        const results = await getTable().destroy(batch);
        deletedRecords.push(...results);
      }

      return deletedRecords;
    } catch (error) {
      throw new Error(`فشل حذف السجلات: ${error.message}`);
    }
  }

  /**
   * الحصول على عدد السجلات
   * @returns {Promise<number>}
   */
  async countRecords() {
    try {
      const records = await this.getAllRecords();
      return records.length;
    } catch (error) {
      throw new Error(`فشل عد السجلات: ${error.message}`);
    }
  }

  /**
   * الحصول على السجلات بالترتيب والفرز
   * @param {Object} options - خيارات الترتيب والفرز
   * @returns {Promise<Array>}
   */
  async getSortedRecords(options = {}) {
    try {
      const {
        sortBy = [],
        filterByFormula = null,
        maxRecords = 100
      } = options;

      const selectOptions = {
        sort: sortBy,
        maxRecords: maxRecords
      };

      if (filterByFormula) {
        selectOptions.filterByFormula = filterByFormula;
      }

      return await this.getAllRecords(selectOptions);
    } catch (error) {
      throw new Error(`فشل في الحصول على السجلات المرتبة: ${error.message}`);
    }
  }
}

module.exports = new AirtableService();