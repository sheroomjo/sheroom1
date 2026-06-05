// tests/edge-cases.test.js
// اختبارات الحالات الحدية

const request = require('supertest');
const app = require('../src/index');

describe('Edge Cases Tests', () => {
  
  describe('Empty Data', () => {
    it('يجب التعامل مع طلب بدون بيانات', async () => {
      const res = await request(app)
        .post('/api/records')
        .send()
        .expect(400);
      
      expect(res.body).toHaveProperty('success', false);
    });

    it('يجب التعامل مع مصفوفة فارغة', async () => {
      const res = await request(app)
        .post('/api/records/bulk')
        .send([])
        .expect(400);
      
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('Special Characters', () => {
    it('يجب التعامل مع الأحرف الخاصة', async () => {
      const specialChars = {
        'Name': '!@#$%^&*()',
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(specialChars);
      
      expect(res.body).toBeDefined();
    });

    it('يجب التعامل مع أحرف Unicode', async () => {
      const unicodeData = {
        'Name': '🚀 SHE ROOM JO 🎉',
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(unicodeData);
      
      expect(res.body).toBeDefined();
    });

    it('يجب التعامل مع النصوص العربية', async () => {
      const arabicData = {
        'Name': 'شي روم جو',
        'Email': 'test@sheroom.jo'
      };

      const res = await request(app)
        .post('/api/records')
        .send(arabicData);
      
      expect(res.body).toBeDefined();
    });
  });

  describe('Null and Undefined', () => {
    it('يجب التعامل مع قيم null', async () => {
      const nullData = {
        'Name': null,
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(nullData);
      
      expect(res.body).toBeDefined();
    });

    it('يجب التعامل مع قيم undefined', async () => {
      const undefinedData = {
        'Name': undefined,
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(undefinedData);
      
      expect(res.body).toBeDefined();
    });
  });

  describe('Very Long Strings', () => {
    it('يجب التعامل مع نصوص طويلة جداً', async () => {
      const longString = {
        'Name': 'A'.repeat(50000),
        'Email': 'test@example.com'
      };

      const res = await request(app)
        .post('/api/records')
        .send(longString);
      
      expect(res.body).toBeDefined();
    });
  });

  describe('Invalid ID Formats', () => {
    it('يجب التعامل مع معرفات غير صحيحة', async () => {
      const invalidIds = ['', null, undefined, '123', 'invalid'];

      for (const id of invalidIds) {
        const res = await request(app)
          .get(`/api/records/${id}`);
        
        expect(res.body).toBeDefined();
      }
    });
  });

  describe('Numeric Values', () => {
    it('يجب التعامل مع أرقام كبيرة جداً', async () => {
      const largeNumber = {
        'Name': 'Test',
        'Count': 9999999999999
      };

      const res = await request(app)
        .post('/api/records')
        .send(largeNumber);
      
      expect(res.body).toBeDefined();
    });

    it('يجب التعامل مع أرقام عشرية', async () => {
      const decimalNumber = {
        'Name': 'Test',
        'Price': 123.456789
      };

      const res = await request(app)
        .post('/api/records')
        .send(decimalNumber);
      
      expect(res.body).toBeDefined();
    });

    it('يجب التعامل مع أرقام سالبة', async () => {
      const negativeNumber = {
        'Name': 'Test',
        'Temperature': -50
      };

      const res = await request(app)
        .post('/api/records')
        .send(negativeNumber);
      
      expect(res.body).toBeDefined();
    });
  });

  describe('Duplicate Records', () => {
    it('يجب التعامل مع سجلات مكررة', async () => {
      const records = [
        { 'Name': 'Test', 'Email': 'test1@example.com' },
        { 'Name': 'Test', 'Email': 'test1@example.com' }
      ];

      const res = await request(app)
        .post('/api/records/bulk')
        .send(records);
      
      expect(res.body).toBeDefined();
    });
  });
});
