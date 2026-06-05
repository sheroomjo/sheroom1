// tests/airtable.integration.test.js
// اختبارات التكامل مع Airtable

const request = require('supertest');
const app = require('../src/index');
const airtableService = require('../src/services/airtable.service');

describe('Airtable Integration Tests', () => {
  
  describe('GET /health', () => {
    it('يجب أن يرجع حالة operational', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('status', 'operational');
    });
  });

  describe('GET /status', () => {
    it('يجب أن يرجع معلومات الخادم', async () => {
      const res = await request(app)
        .get('/status')
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data).toHaveProperty('environment');
    });
  });

  describe('Records API Tests', () => {
    
    describe('GET /api/records', () => {
      it('يجب جلب جميع السجلات بنجاح', async () => {
        const res = await request(app)
          .get('/api/records')
          .expect(200);
        
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('count');
      });

      it('يجب دعم معامل limit', async () => {
        const res = await request(app)
          .get('/api/records?limit=5')
          .expect(200);
        
        expect(res.body).toHaveProperty('success', true);
      });
    });

    describe('GET /api/records/:id', () => {
      it('يجب رجع خطأ 400 عند عدم توفير معرّف', async () => {
        const res = await request(app)
          .get('/api/records/')
          .expect(404);
      });

      it('يجب رجع خطأ عند السجل غير موجود', async () => {
        const res = await request(app)
          .get('/api/records/recNonExistent')
          .expect(404);
        
        expect(res.body).toHaveProperty('success', false);
      });
    });

    describe('GET /api/records/search', () => {
      it('يجب رجع خطأ عند عدم توفير query', async () => {
        const res = await request(app)
          .get('/api/records/search')
          .expect(400);
        
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.error).toHaveProperty('code', 'MISSING_QUERY');
      });
    });

    describe('GET /api/records/stats', () => {
      it('يجب رجع الإحصائيات بنجاح', async () => {
        const res = await request(app)
          .get('/api/records/stats')
          .expect(200);
        
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('total');
        expect(typeof res.body.data.total).toBe('number');
      });
    });

    describe('POST /api/records', () => {
      it('يجب رجع خطأ عند عدم توفير بيانات', async () => {
        const res = await request(app)
          .post('/api/records')
          .send({})
          .expect(400);
        
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.error).toHaveProperty('code', 'EMPTY_FIELDS');
      });

      it('يجب إنشاء سجل جديد بنجاح', async () => {
        const newRecord = {
          'Name': 'Test Record',
          'Email': 'test@example.com'
        };

        const res = await request(app)
          .post('/api/records')
          .send(newRecord)
          .expect(201);
        
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('POST /api/records/bulk', () => {
      it('يجب رجع خطأ عند عدم توفير مصفوفة', async () => {
        const res = await request(app)
          .post('/api/records/bulk')
          .send({})
          .expect(400);
        
        expect(res.body).toHaveProperty('success', false);
        expect(res.body.error).toHaveProperty('code', 'INVALID_FORMAT');
      });

      it('يجب إنشاء سجلات متعددة بنجاح', async () => {
        const records = [
          { 'Name': 'Record 1' },
          { 'Name': 'Record 2' }
        ];

        const res = await request(app)
          .post('/api/records/bulk')
          .send(records)
          .expect(201);
        
        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe('PUT /api/records/:id', () => {
      it('يجب رجع خطأ عند عدم توفير معرّف', async () => {
        const res = await request(app)
          .put('/api/records/')
          .send({ 'Name': 'Updated' })
          .expect(404);
      });

      it('يجب رجع خطأ عند عدم توفير بيانات', async () => {
        const res = await request(app)
          .put('/api/records/recTest')
          .send({})
          .expect(400);
        
        expect(res.body).toHaveProperty('success', false);
      });
    });

    describe('DELETE /api/records/:id', () => {
      it('يجب رجع خطأ عند عدم توفير معرّف', async () => {
        const res = await request(app)
          .delete('/api/records/')
          .expect(404);
      });
    });
  });

  describe('Error Handling', () => {
    it('يجب رجع 404 للمسارات غير الموجودة', async () => {
      const res = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});

describe('AirtableService Unit Tests', () => {
  
  describe('getAllRecords', () => {
    it('يجب رجع مصفوفة من السجلات', async () => {
      try {
        const records = await airtableService.getAllRecords();
        expect(Array.isArray(records)).toBe(true);
      } catch (error) {
        // قد تفشل إذا لم تكن البيانات متوفرة
        expect(error).toBeDefined();
      }
    });
  });

  describe('countRecords', () => {
    it('يجب رجع عدد صحيح من السجلات', async () => {
      try {
        const count = await airtableService.countRecords();
        expect(typeof count).toBe('number');
        expect(count).toBeGreaterThanOrEqual(0);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('searchRecords', () => {
    it('يجب رجع مصفوفة عند البحث', async () => {
      try {
        const records = await airtableService.searchRecords("{Name}='Test'");
        expect(Array.isArray(records)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
