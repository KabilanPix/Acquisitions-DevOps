import app from '#src/app.js';
import request from 'supertest';

describe('API ENdpoints', () => {
  describe('GET /health', () => {
    it('Should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .set('User-Agent', 'supertest')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('Should return API message', async () => {
      const response = await request(app)
        .get('/api')
        .set('User-Agent', 'supertest')
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is running!'
      );
    });
  });

  describe('GET /nonexistent', () => {
    it('Should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .set('User-Agent', 'supertest')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
