import request from 'supertest';
import app from '../src/app';

describe('Health Check Endpoints', () => {
  it('GET /api/v1/health should return health status with correct structure', async () => {
    const response = await request(app).get('/api/v1/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version', 'v1.0.0');
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('GET /api/v1/health should return server status as OK', async () => {
    const response = await request(app).get('/api/v1/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('GET /api/v1/health should contain valid timestamp', async () => {
    const response = await request(app).get('/api/v1/health');
    const timestamp = new Date(response.body.timestamp);
    
    expect(response.status).toBe(200);
    expect(timestamp instanceof Date).toBe(true);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});