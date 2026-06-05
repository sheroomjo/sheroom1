# ⚙️ دليل الإعداد - SHE ROOM JO

---

## 🔧 متطلبات النظام

### الحد الأدنى من المتطلبات

| البرنامج | الإصدار الأدنى | الملاحظات |
|---------|----------------|----------|
| Node.js | 14.0.0 | التوصية: 16+ |
| npm | 6.0.0 | أو استخدم yarn 1.22+ |
| Git | 2.25.0 | أو أعلى |

### متطلبات اختيارية

- Docker (للتطوير في بيئة معزولة)
- MongoDB (إذا كان ينطبق على المشروع)
- Redis (للـ caching)

---

## 📥 خطوات التثبيت

### 1. استنساخ المستودع

```bash
# استنساخ المستودع
git clone https://github.com/sheroomjo/sheroom1.git

# الانتقال إلى مجلد المشروع
cd sheroom1
```

### 2. تثبيت المكتبات

```bash
# استخدام npm
npm install

# أو استخدام yarn
yarn install
```

### 3. إعداد متغيرات البيئة

```bash
# نسخ ملف المثال
cp .env.example .env

# تحرير الملف وإضافة بيانات البيئة الخاصة بك
nano .env
```

### 4. بدء التطبيق

```bash
# بيئة التطوير
npm run dev

# إنتاج
npm run build
npm start
```

---

## 🐳 التثبيت باستخدام Docker

### بناء الصورة

```bash
docker build -t sheroom1:latest .
```

### تشغيل الحاوية

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  --name sheroom1-container \
  sheroom1:latest
```

### استخدام Docker Compose

```bash
docker-compose up -d
```

---

## 📋 متغيرات البيئة

تحتاج إلى تعريف المتغيرات التالية في ملف `.env`:

```env
# البيئة
NODE_ENV=development

# المنفذ
PORT=3000

# قاعدة البيانات
DATABASE_URL=mongodb://localhost:27017/sheroom1

# المفاتيح السرية
JWT_SECRET=your-secret-key-here
API_KEY=your-api-key-here

# تكوين Redis
REDIS_URL=redis://localhost:6379

# تكوين البريد الإلكتروني
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASSWORD=your-password

# تكوين Logging
LOG_LEVEL=info
```

---

## 🧪 الاختبارات

### تشغيل جميع الاختبارات

```bash
npm test
```

### الاختبارات مع التغطية

```bash
npm run test:coverage
```

### الاختبارات المراقبة (Watch)

```bash
npm run test:watch
```

---

## 🔍 Linting والتنسيق

### التحقق من معايير الكود

```bash
npm run lint
```

### إصلاح مشاكل التنسيق تلقائياً

```bash
npm run lint:fix
```

### تنسيق الكود باستخدام Prettier

```bash
npm run format
```

---

## 📚 بناء التوثيق

### إنشاء التوثيق

```bash
npm run docs:build
```

### عرض التوثيق محلياً

```bash
npm run docs:serve
```

---

## 🚀 البناء والنشر

### بناء المشروع

```bash
npm run build
```

### بناء الإنتاج

```bash
npm run build:prod
```

### النشر على Vercel

```bash
vercel deploy
```

### النشر على Heroku

```bash
heroku create sheroom1
git push heroku main
```

---

## 🔐 الأمان

### التحقق من الثغرات

```bash
npm audit
```

### إصلاح الثغرات تلقائياً

```bash
npm audit fix
```

### المسح الأمني المتقدم

```bash
npm run security:scan
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: فشل npm install

**الحل:**
```bash
# حذف package-lock.json و node_modules
rm -rf node_modules package-lock.json

# إعادة التثبيت
npm cache clean --force
npm install
```

### المشكلة: الحصول على خطأ المنفذ

**الحل:**
```bash
# تغيير المنفذ في .env
PORT=3001

# أو إيقاف العملية على المنفذ
# على Linux/Mac:
lsof -ti:3000 | xargs kill -9

# على Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### المشكلة: الاتصال بقاعدة البيانات فشل

**الحل:**
```bash
# التحقق من اتصال MongoDB
mongo mongodb://localhost:27017

# أو استخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 📖 روابط مفيدة

- [Node.js Docs](https://nodejs.org/docs/)
- [npm Docs](https://docs.npmjs.com/)
- [Git Docs](https://git-scm.com/doc)
- [Docker Docs](https://docs.docker.com/)

---

## 💬 الدعم

إذا واجهت مشاكل:

1. تحقق من هذا الدليل
2. ابحث في GitHub Issues
3. افتح Issue جديدة
4. تواصل معنا عبر البريد الإلكتروني

---

**آخر تحديث:** 2026-06-05
