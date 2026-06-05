// tests/api.performance.test.js
// اختبارات الأداء

const request = require('supertest');
const app = require('../src/index');

describe('API Performance Tests', () => {
  
  describe('Response Time', () => {
    it('يجب أن تكون استجابة /health أقل من 100ms', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(100);
    });

    it('يجب أن تكون استجابة /api/records أقل من 5000ms', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/records')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(5000);
    });

    it('يجب أن تكون استجابة /status أقل من 100ms', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/status')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(100);
    });
  });

  describe('Concurrent Requests', () => {
    it('يجب التعامل مع طلبات متزامنة متعددة', async () => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .get('/health')
            .expect(200)
        );
      }
      
      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach(res => {
        expect(res.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Load Testing', () => {
    it('يجب التعامل مع 10 طلبات متتالية', async () => {
      for (let i = 0; i < 10; i++) {
        const res = await request(app)
          .get('/api/records')
          .expect(200);
        
        expect(res.body).toHaveProperty('success', true);
      }
    });
  });

  describe('Response Size', () => {
    it('يجب أن يكون حجم الاستجابة معقول', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      
      const responseSize = JSON.stringify(res.body).length;
      expect(responseSize).toBeLessThan(1000);
    });
  });
});
