# 🔧 إعداد Airtable Integration - SHE ROOM JO

هذا الدليل يشرح كيفية تكامل Airtable مع مشروع SHE ROOM JO.

---

## 📋 المتطلبات

- Airtable Account (حساب Airtable)
- API Key من Airtable
- Base ID للقاعدة التي تريد الاتصال بها
- Node.js >= 14.0.0

---

## 🚀 خطوات البدء

### 1. الحصول على Airtable API Key

1. اذهب إلى [Airtable Account Settings](https://airtable.com/account)
2. انقر على **"Personal access tokens"**
3. انقر على **"Create token"**
4. أضف الصلاحيات المطلوبة:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. انقر على **"Create token"**
6. انسخ الرمز وحفظه بأمان

### 2. الحصول على Base ID

1. اذهب إلى [Airtable API Documentation](https://airtable.com/api)
2. اختر القاعدة التي تريد
3. ستجد Base ID في الصفحة
4. أو انسخه من URL: `airtable.com/appXXXXXXXXXXXXXX`

### 3. تحديث ملف .env

```env
# Airtable Configuration
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Records
```

---

## 📦 تثبيت المكتبات

```bash
# تثبيت مكتبة Airtable
npm install airtable

# أو إذا كنت تستخدم yarn
yarn add airtable
```

---

## 🔌 إعداد الاتصال

### ملف src/integrations/airtable.js

```javascript
const Airtable = require('airtable');

// التحقق من وجود المتغيرات المطلوبة
if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not defined');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not defined');
}

// إعداد Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID);

module.exports = base;
```

---

## 📝 أمثلة عملية

### 1. قراءة جميع السجلات

```javascript
const base = require('./integrations/airtable');

async function getAllRecords() {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_NAME)
      .select()
      .eachPage((pageRecords, nextPage) => {
        records.push(...pageRecords);
        nextPage();
      });
    
    return records;
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
}

// الاستخدام
getAllRecords().then(records => {
  console.log(`تم جلب ${records.length} سجل`);
  console.log(records);
});
```

### 2. إنشاء سجل جديد

```javascript
async function createRecord(fields) {
  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME).create(fields);
    console.log('تم إنشاء السجل:', record.id);
    return record;
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
}

// الاستخدام
createRecord({
  'الاسم': 'أحمد محمد',
  'البريد الإلكتروني': 'ahmed@example.com',
  'الحالة': 'نشط'
});
```

### 3. تحديث سجل

```javascript
async function updateRecord(recordId, fields) {
  try {
    const record = await base(process.env.AIRTABLE_TABLE_NAME)
      .update(recordId, fields);
    console.log('تم تحديث السجل:', recordId);
    return record;
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}

// الاستخدام
updateRecord('recXXXXXXXXXXXXXX', {
  'الاسم': 'محمد أحمد',
  'الحالة': 'معطل'
});
```

### 4. حذف سجل

```javascript
async function deleteRecord(recordId) {
  try {
    await base(process.env.AIRTABLE_TABLE_NAME).destroy(recordId);
    console.log('تم حذف السجل:', recordId);
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
}

// الاستخدام
deleteRecord('recXXXXXXXXXXXXXX');
```

### 5. البحث عن السجلات

```javascript
async function searchRecords(filterByFormula) {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: filterByFormula
      })
      .eachPage((pageRecords, nextPage) => {
        records.push(...pageRecords);
        nextPage();
      });
    
    return records;
  } catch (error) {
    console.error('Error searching records:', error);
    throw error;
  }
}

// الاستخدام
// البحث عن جميع السجلات النشطة
searchRecords("{الحالة} = 'نشط'");
```

---

## 🔍 اختبار الاتصال

### ملف test/airtable.test.js

```javascript
const base = require('../src/integrations/airtable');

describe('Airtable Integration', () => {
  test('يجب الاتصال بـ Airtable بنجاح', async () => {
    try {
      const records = [];
      await base(process.env.AIRTABLE_TABLE_NAME)
        .select({ maxRecords: 1 })
        .eachPage((pageRecords, nextPage) => {
          records.push(...pageRecords);
          nextPage();
        });
      
      expect(Array.isArray(records)).toBe(true);
    } catch (error) {
      throw error;
    }
  });
});
```

---

## 🚨 المشاكل الشائعة والحلول

### المشكلة: "AIRTABLE_API_KEY is not defined"

**الحل:**
```bash
# تأكد من إضافة المتغير في .env
cat .env
# يجب أن يحتوي على:
# AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
```

### المشكلة: "Invalid API key"

**الحل:**
1. تأكد من أن الرمز صحيح
2. تحقق من انتهاء صلاحية الرمز
3. أعد إنشاء الرمز من Airtable Account Settings

### المشكلة: "Table not found"

**الحل:**
1. تأكد من أن اسم الجدول صحيح (حساس لحالة الأحرف)
2. تحقق من Base ID
3. استخدم Airtable API Explorer للتحقق

### المشكلة: "Permission denied"

**الحل:**
تأكد من أن الرمز يملك الصلاحيات المطلوبة:
- `data.records:read`
- `data.records:write`
- `schema.bases:read`

---

## 🔒 أفضل الممارسات الأمنية

1. **لا تشارك API Keys**
   ```javascript
   // ✅ صحيح
   const apiKey = process.env.AIRTABLE_API_KEY;
   
   // ❌ خطأ
   const apiKey = 'patXXXXXXXXXXXXXX'; // لا تكتبها مباشرة
   ```

2. **استخدم .env.example**
   ```env
   # .env.example
   AIRTABLE_API_KEY=your-api-key-here
   AIRTABLE_BASE_ID=your-base-id-here
   ```

3. **اضف .env إلى .gitignore**
   ```
   # .gitignore
   .env
   .env.local
   ```

---

## 📚 مراجع مفيدة

- [Airtable API Documentation](https://airtable.com/api)
- [Airtable.js Documentation](https://github.com/Airtable/airtable.js)
- [Airtable Formula Syntax](https://support.airtable.com/hc/en-us/articles/203255215)

---

**آخر تحديث:** 2026-06-05
