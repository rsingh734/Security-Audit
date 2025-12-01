// Define interface for function output
export interface PortfolioPerformanceResult {
    initialInvestment: number;
    currentValue: number;
    profitOrLoss: number;
    percentageChange: number;
    performanceSummary: string;
}

// Defining interface for largest holding
export interface Asset {
    name: string;
    value: number;
    type: string;
}

// Defining interface for AssetAllocation
export interface AssetAllocation {
 [assetType: string]: number; 
}

// Removed 'any' and added parameters with default values for dynamin inputs
export function calculatePortfolioPerformance(
    initialInvestment = 10000,
    currentValue = 15000,
): PortfolioPerformanceResult {

// Correct profit/loss calcualations
    const profitOrLoss = currentValue - initialInvestment;

// Correct calcualations with zero-division protection
    const percentageChange = initialInvestment !== 0
        ? (profitOrLoss / initialInvestment) * 100
        : 0;

// Determine performance summary without if statements
    const isSignificantGain = percentageChange > 20;
    const isProfit = profitOrLoss > 0;
    const isLoss = profitOrLoss < 0;
    const isNeutral = profitOrLoss === 0;

    const performanceSummary = 
        isSignificantGain ? `The portfolio has gained significantly with a 
        profit of $${profitOrLoss.toFixed(2)}.` :

        isProfit ? `The portfolio has gained with a profit of
         $${profitOrLoss.toFixed(2)}.` :

        isLoss ? `The portfolio has lost 
        $${Math.abs(profitOrLoss).toFixed(2)}.` :

        `The portfolio value remains unchanged.`;

    return {
        initialInvestment,
        currentValue,
        profitOrLoss,
        percentageChange,
        performanceSummary,
    };
}

// Function 1: Find the Largest Holding
export function findLargestHolding(assets: Asset[]): Asset | null {
    if (!assets || assets.length === 0) {
        return null;
    }

    return assets.reduce((largest, current) => 
        current.value > largest.value ? current : largest
    );
}

// Function 2: Asset Allocation Percentage
export function calculateAssetAllocation(assets: Asset[]): AssetAllocation {
    if (!assets || assets.length === 0) {
        return {};
    }

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    if (totalValue === 0) {
        return {};
    }

    const allocation: AssetAllocation = {};
    
    assets.forEach(asset => {
        const percentage = (asset.value / totalValue) * 100;
        if (allocation[asset.type]) {
            allocation[asset.type] += percentage;
        } else {
            allocation[asset.type] = percentage;
        }
    });

    return allocation;
}