import express from 'express';
import { 
    calculatePortfolioPerformance, 
    findLargestHolding, 
    calculateAssetAllocation,
    Asset 
} from './portfolio/portfolioPerformance';

const app = express();

// Middleware
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  const healthData = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: 'v1.0.0'
  };
  res.json(healthData);
});

// Portfolio performance endpoint
app.get('/api/v1/portfolio/performance', (req, res) => {
    const initialInvestment = parseFloat(req.query.initialInvestment as string) || 10000;
    const currentValue = parseFloat(req.query.currentValue as string) || 12000;
    
    const result = calculatePortfolioPerformance(initialInvestment, currentValue);
    res.json(result);
});

// Largest holding endpoint
app.get('/api/v1/portfolio/largest-holding', (req, res) => {
    // Sample assets data - in real application, this would come from a database
    const sampleAssets: Asset[] = [
        { name: 'Apple Stock', value: 15000, type: 'stock' },
        { name: 'Google Stock', value: 25000, type: 'stock' },
        { name: 'Family Home', value: 500000, type: 'real estate' },
        { name: 'Government Bonds', value: 30000, type: 'bond' }
    ];
    
    const result = findLargestHolding(sampleAssets);
    res.json({ largestHolding: result });
});

// Asset allocation endpoint
app.get('/api/v1/portfolio/allocation', (req, res) => {
    // Sample assets data - in real application, this would come from a database
    const sampleAssets: Asset[] = [
        { name: 'Apple Stock', value: 25000, type: 'stock' },
        { name: 'Google Stock', value: 25000, type: 'stock' },
        { name: 'Government Bonds', value: 50000, type: 'bond' }
    ];
    
    const result = calculateAssetAllocation(sampleAssets);
    res.json({ allocation: result });
});

// Export the app
export default app;