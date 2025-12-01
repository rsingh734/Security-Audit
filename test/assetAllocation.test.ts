import { 
    calculateAssetAllocation,
    Asset
} from '../src/portfolio/portfolioPerformance';

describe('calculateAssetAllocation', () => {
    const sampleAssets: Asset[] = [
        { name: 'Apple Stock', value: 25000, type: 'stock' },
        { name: 'Google Stock', value: 25000, type: 'stock' },
        { name: 'Government Bonds', value: 50000, type: 'bond' }
    ];

    it('should calculate correct percentages for even distribution', () => {
        const allocation = calculateAssetAllocation(sampleAssets);
        
        expect(allocation.stock).toBe(50); // (25000 + 25000) / 100000 * 100 = 50%
        expect(allocation.bond).toBe(50);  // 50000 / 100000 * 100 = 50%
    });

    it('should handle uneven distribution', () => {
        const unevenAssets: Asset[] = [
            { name: 'Stock A', value: 75000, type: 'stock' },
            { name: 'Bond A', value: 25000, type: 'bond' }
        ];
        
        const allocation = calculateAssetAllocation(unevenAssets);
        
        expect(allocation.stock).toBe(75); // 75000 / 100000 * 100 = 75%
        expect(allocation.bond).toBe(25);  // 25000 / 100000 * 100 = 25%
    });

    it('should return empty object for empty assets array', () => {
        const allocation = calculateAssetAllocation([]);
        
        expect(allocation).toEqual({});
    });
});