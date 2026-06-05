// src/integrations/airtable.js
// تكامل Airtable - ملف الاتصال الرئيسي

const Airtable = require('airtable');

// التحقق من المتغيرات المطلوبة
const requiredEnvVars = [
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_TABLE_NAME'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`⚠️ تحذير: المتغير ${envVar} غير محدد`);
  }
});

// إعداد Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

// إنشاء instance للقاعدة
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

/**
 * دالة للاتصال بجدول معين
 * @param {string} tableName - اسم الجدول
 * @returns {Object} - instance الجدول
 */
function getTable(tableName = process.env.AIRTABLE_TABLE_NAME) {
  return base(tableName);
}

/**
 * دالة للتحقق من الاتصال
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  try {
    const records = [];
    await getTable()
      .select({ maxRecords: 1 })
      .eachPage((pageRecords) => {
        records.push(...pageRecords);
      });
    return true;
  } catch (error) {
    console.error('❌ خطأ في الاتصال بـ Airtable:', error.message);
    return false;
  }
}

module.exports = {
  airtable,
  base,
  getTable,
  testConnection
};
