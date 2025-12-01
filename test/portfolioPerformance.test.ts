import { 
    calculatePortfolioPerformance, 
} from '../src/portfolio/portfolioPerformance';

describe('calculatePortfolioPerformance - Required Test Cases', () => {
    it('should handle profit case (currentValue > initialInvestment)', () => {
        const result = calculatePortfolioPerformance(10000, 15000);
        
        // Verify all calculated metrics
        expect(result.initialInvestment).toBe(10000);
        expect(result.currentValue).toBe(15000);
        expect(result.profitOrLoss).toBe(5000); // 15000 - 10000 = 5000 profit
        expect(result.percentageChange).toBe(50); // (5000/10000)*100 = 50%
        
        // Verify performance summary message for profit
        expect(result.performanceSummary).toContain('profit');
        expect(result.performanceSummary).toContain('$5000.00');
    });

    it('should handle loss case (currentValue < initialInvestment)', () => {
        const result = calculatePortfolioPerformance(10000, 8000);
        
        // Verify all calculated metrics
        expect(result.initialInvestment).toBe(10000);
        expect(result.currentValue).toBe(8000);
        expect(result.profitOrLoss).toBe(-2000); // 8000 - 10000 = -2000 loss
        expect(result.percentageChange).toBe(-20); // (-2000/10000)*100 = -20%
        
        // Verify performance summary message for loss
        expect(result.performanceSummary).toContain('lost');
        expect(result.performanceSummary).toContain('$2000.00');
    });

    it('should handle no change case (currentValue = initialInvestment)', () => {
        const result = calculatePortfolioPerformance(10000, 10000);
        
        // Verify all calculated metrics
        expect(result.initialInvestment).toBe(10000);
        expect(result.currentValue).toBe(10000);
        expect(result.profitOrLoss).toBe(0); // 10000 - 10000 = 0
        expect(result.percentageChange).toBe(0); // (0/10000)*100 = 0%
        
        // Verify performance summary message for no change
        expect(result.performanceSummary).toContain('unchanged');
        expect(result.performanceSummary).not.toContain('profit');
        expect(result.performanceSummary).not.toContain('lost');
    });
});