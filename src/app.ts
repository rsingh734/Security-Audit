import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { 
    calculatePortfolioPerformance, 
    findLargestHolding, 
    calculateAssetAllocation,
    Asset 
} from './portfolio/portfolioPerformance';

const app = express();

// VULNERABLE: Hardcoded secrets - CodeQL will detect these
const config = {
    databasePassword: 'SuperSecretDBPassword123!',
    apiKey: 'sk_live_1234567890abcdefghijklmnop',
    adminToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    encryptionKey: 'myweakencryptionkey123'
};

// Middleware
app.use(express.json());

// VULNERABLE: Security misconfiguration - no security headers
app.use((req, res, next) => {
    // Missing security headers like CSP, HSTS, etc.
    next();
});

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
    version: 'v1.0.0',
    // VULNERABLE: Information disclosure - exposing internal info
    secretKey: config.encryptionKey
  };
  res.json(healthData);
});

// VULNERABLE: SQL Injection - CodeQL will detect this
app.get('/api/v1/portfolio/user-portfolio', (req, res) => {
    const userId = req.query.userId as string;
    
    // VULNERABLE: Direct SQL concatenation
    const query = `SELECT * FROM portfolios WHERE user_id = ${userId}`;
    
    // Simulate database query
    console.log('Executing vulnerable query:', query);
    
    res.json({ 
        message: 'Portfolio data fetched',
        query: query, // VULNERABLE: Exposing query in response
        userId: userId
    });
});

// VULNERABLE: Command Injection - CodeQL will detect this
app.post('/api/v1/admin/clear-cache', (req, res) => {
    const cacheType = req.body.cacheType as string;
    
    // VULNERABLE: User input in system command
    exec(`redis-cli flush ${cacheType}`, (error, stdout) => {
        if (error) {
            res.status(500).json({ error: 'Cache clearance failed' });
            return;
        }
        res.json({ message: `Cache ${cacheType} cleared successfully` });
    });
});

// VULNERABLE: Path Traversal - CodeQL will detect this
app.get('/api/v1/portfolio/report', (req, res) => {
    const reportName = req.query.reportName as string;
    
    // VULNERABLE: No path sanitization
    const filePath = path.join(__dirname, 'reports', reportName);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).json({ error: 'Report not found' });
            return;
        }
        res.json({ report: data });
    });
});

// VULNERABLE: Unsafe deserialization simulation
app.post('/api/v1/portfolio/import', (req, res) => {
    const portfolioData = req.body.data as string;
    
    // VULNERABLE: Using eval with user input
    try {
        const parsedData = eval(`(${portfolioData})`);
        res.json({ 
            message: 'Portfolio imported successfully',
            data: parsedData 
        });
    } catch (error) {
        res.status(400).json({ error: 'Invalid portfolio data' });
    }
});

// VULNERABLE: No rate limiting - brute force vulnerability
app.post('/api/v1/admin/login', (req, res) => {
    const username = req.body.username as string;
    const password = req.body.password as string;
    
    // VULNERABLE: No rate limiting, weak credential check
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            message: 'Login successful',
            token: config.adminToken 
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
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

// VULNERABLE: Information disclosure - debug endpoint
app.get('/api/v1/debug/config', (req, res) => {
    // VULNERABLE: Exposing all configuration including secrets
    res.json({
        config: config,
        environment: process.env,
        nodeVersion: process.version
    });
});

// VULNERABLE: No input validation
app.post('/api/v1/portfolio/calculate', (req, res) => {
    const calculation = req.body.calculation as string;
    
    // VULNERABLE: Using Function constructor with user input
    try {
        const result = new Function(`return ${calculation}`)();
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({ error: 'Calculation failed' });
    }
});

// Export the app
export default app;
