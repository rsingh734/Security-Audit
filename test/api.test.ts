import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
    describe('GET /api/v1/portfolio/performance', () => {
        it('should return portfolio performance with default values', async () => {
            const response = await request(app).get('/api/v1/portfolio/performance');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('initialInvestment');
            expect(response.body).toHaveProperty('currentValue');
            expect(response.body).toHaveProperty('profitOrLoss');
            expect(response.body).toHaveProperty('percentageChange');
            expect(response.body).toHaveProperty('performanceSummary');
        });

        it('should return portfolio performance with custom values', async () => {
            const response = await request(app)
                .get('/api/v1/portfolio/performance?initialInvestment=5000&currentValue=7500');
            
            expect(response.status).toBe(200);
            expect(response.body.initialInvestment).toBe(5000);
            expect(response.body.currentValue).toBe(7500);
            expect(response.body.profitOrLoss).toBe(2500);
        });
    });

    describe('GET /api/v1/portfolio/largest-holding', () => {
        it('should return the largest holding from sample assets', async () => {
            const response = await request(app).get('/api/v1/portfolio/largest-holding');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('largestHolding');
            expect(response.body.largestHolding).toHaveProperty('name');
            expect(response.body.largestHolding).toHaveProperty('value');
            expect(response.body.largestHolding).toHaveProperty('type');
        });
    });

    describe('GET /api/v1/portfolio/allocation', () => {
        it('should return asset allocation percentages', async () => {
            const response = await request(app).get('/api/v1/portfolio/allocation');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('allocation');
            expect(response.body.allocation).toHaveProperty('stock');
            expect(response.body.allocation).toHaveProperty('bond');
            
            // Should add up to approximately 100%
            const percentages = Object.values(response.body.allocation) as number[];
            const totalPercentage = percentages.reduce((sum, percent) => sum + percent, 0);
            expect(totalPercentage).toBeCloseTo(100, 1);
        });
    });
});