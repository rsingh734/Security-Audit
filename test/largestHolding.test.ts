import { 
    findLargestHolding,
    Asset
} from '../src/portfolio/portfolioPerformance';

describe('findLargestHolding', () => {
    const sampleAssets: Asset[] = [
        { name: 'Apple Stock', value: 15000, type: 'stock' },
        { name: 'Google Stock', value: 25000, type: 'stock' },
        { name: 'Family Home', value: 500000, type: 'real estate' },
        { name: 'Government Bonds', value: 30000, type: 'bond' }
    ];

    it('should return the asset with the highest value', () => {
        const largest = findLargestHolding(sampleAssets);
        
        expect(largest).toBeDefined();
        expect(largest!.name).toBe('Family Home');
        expect(largest!.value).toBe(500000);
    });

    it('should return null for empty assets array', () => {
        const result = findLargestHolding([]);
        
        expect(result).toBeNull();
    });

    it('should handle tied values by returning the first largest', () => {
        const tiedAssets: Asset[] = [
            { name: 'Asset A', value: 10000, type: 'stock' },
            { name: 'Asset B', value: 10000, type: 'bond' },
            { name: 'Asset C', value: 5000, type: 'real estate' }
        ];
        
        const largest = findLargestHolding(tiedAssets);
        
        expect(largest).toBeDefined();
        expect(largest!.value).toBe(10000);
        // Should return the first asset with the maximum value
        expect(largest!.name).toBe('Asset A');
    });
});