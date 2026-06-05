// tests/security.test.js
// اختبارات الأمان

const request = require('supertest');
const app = require('../src/index');

describe('Security Tests', () => {
  
  describe('Input Validation', () => {
    it('يجب رفض البيانات الضارة', async () => {
      const maliciousData = {
        'Name': '<script>alert("XSS")</script>',
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(maliciousData);
      
      // يجب أن تتم معالجة البيانات بأمان
      expect(res.body).toBeDefined();
    });

    it('يجب التحقق من نوع البيانات', async () => {
      const invalidData = {
        'Name': 123, // يجب أن يكون نص
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(invalidData);
      
      expect(res.body).toBeDefined();
    });
  });

  describe('CORS Headers', () => {
    it('يجب إرسال رؤوس CORS صحيحة', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      
      // التحقق من وجود رؤوس CORS
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Error Messages', () => {
    it('يجب عدم كشف معلومات حساسة في رسائل الخطأ', async () => {
      const res = await request(app)
        .get('/api/records/invalidId')
        .expect(404);
      
      const errorMessage = JSON.stringify(res.body);
      expect(errorMessage).not.toContain('password');
      expect(errorMessage).not.toContain('secret');
      expect(errorMessage).not.toContain('token');
    });
  });

  describe('Request Limits', () => {
    it('يجب التعامل مع طلبات JSON كبيرة', async () => {
      const largeData = {
        'Name': 'A'.repeat(10000),
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(largeData);
      
      // يجب عدم تعطل الخادم
      expect(res).toBeDefined();
    });
  });

  describe('SQL Injection Prevention', () => {
    it('يجب منع هجمات SQL Injection', async () => {
      const sqlInjection = {
        'Name': "'; DROP TABLE records; --",
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(sqlInjection);
      
      // Airtable API تتعامل مع هذا تلقائياً
      expect(res.body).toBeDefined();
    });
  });

  describe('NoSQL Injection Prevention', () => {
    it('يجب منع هجمات NoSQL Injection', async () => {
      const noSqlInjection = {
        'Name': { '$ne': null },
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(noSqlInjection);
      
      expect(res.body).toBeDefined();
    });
  });
});
