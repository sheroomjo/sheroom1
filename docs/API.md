# 📡 توثيق الـ API - SHE ROOM JO

---

## 🌐 نقطة النهاية الأساسية

```
Base URL: https://api.sheroom.jo/v1
```

---

## 🔐 المصادقة

جميع الطلبات تتطلب رمز Bearer في رأس الطلب:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.sheroom.jo/v1/endpoint
```

### الحصول على رمز مصادقة

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

---

## 📋 الـ Endpoints الأساسية

### الحصول على حالة الخادم

```http
GET /status
Authorization: Bearer TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "status": "operational",
  "version": "1.0.0-alpha",
  "timestamp": "2026-06-05T02:30:00Z"
}
```

### الحصول على معلومات المستخدم

```http
GET /users/:id
Authorization: Bearer TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

## 🔄 أكواد الحالة

| الكود | المعنى | الوصف |
|------|--------|-------|
| 200 | OK | الطلب نجح بنجاح |
| 201 | Created | تم إنشاء المورد بنجاح |
| 400 | Bad Request | خطأ في الطلب أو البيانات المدخلة |
| 401 | Unauthorized | لم يتم تقديم رمز مصادقة صحيح |
| 403 | Forbidden | ليست لديك صلاحية للوصول |
| 404 | Not Found | المورد المطلوب غير موجود |
| 429 | Too Many Requests | تجاوزت الحد المسموح من الطلبات |
| 500 | Server Error | خطأ داخلي في الخادم |

---

## ⚠️ معالجة الأخطاء

### تنسيق رسالة الخطأ

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "وصف الخطأ",
    "details": {}
  }
}
```

### أمثلة على الأخطاء

**خطأ المصادقة:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "بيانات الدخول غير صحيحة"
  }
}
```

**خطأ التحقق:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "خطأ في البيانات المدخلة",
    "details": {
      "email": "البريد الإلكتروني غير صحيح",
      "password": "كلمة المرور مطلوبة"
    }
  }
}
```

---

## 🚦 حدود المعدل (Rate Limiting)

- **الحد الأقصى**: 1000 طلب لكل ساعة
- **الحد الأقصى لكل دقيقة**: 60 طلب
- **الحد الأقصى لكل ثانية**: 10 طلبات

**رؤوس الاستجابة:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623456789
```

---

## 📚 أمثلة عملية

### استخدام cURL

```bash
# الحصول على حالة الخادم
curl -X GET https://api.sheroom.jo/v1/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# إنشاء مورد جديد
curl -X POST https://api.sheroom.jo/v1/resource \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "القيمة"}'
```

### استخدام JavaScript (Fetch API)

```javascript
// الحصول على البيانات
const response = await fetch('https://api.sheroom.jo/v1/status', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### استخدام Python

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.sheroom.jo/v1/status',
    headers=headers
)

print(response.json())
```

---

## 📖 المستندات الإضافية

- [دليل الإعداد](./SETUP.md)
- [دليل المساهمة](./CONTRIBUTING.md)

---

**آخر تحديث:** 2026-06-05
