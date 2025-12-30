// FX Rate Auto-Update System
// Uses Exchange Rate API (free, no auth required)

const FX_RATES = {
    API_URL: 'https://api.exchangerate-api.com/v4/latest/USD',
    UPDATE_INTERVAL: 300000, // 5 minutes
    
    async fetchRates() {
        try {
            const response = await fetch(this.API_URL);
            const data = await response.json();
            return data.rates;
        } catch (error) {
            console.error('Failed to fetch FX rates:', error);
            return null;
        }
    },
    
    async updateMXNRate() {
        const rates = await this.fetchRates();
        if (!rates || !rates.MXN) {
            console.error('MXN rate not available');
            return;
        }
        
        const mxnRate = rates.MXN;
        const rateInput = document.getElementById('currentRate');
        const lastUpdateElement = document.getElementById('lastUpdate');
        
        if (rateInput) {
            rateInput.value = mxnRate.toFixed(2);
            
            // Visual feedback - flash the input
            rateInput.style.backgroundColor = '#d4f4dd';
            setTimeout(() => {
                rateInput.style.backgroundColor = '';
            }, 1000);
        }
        
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            lastUpdateElement.textContent = `Last updated: ${timeString}`;
        }
        
        // Trigger recalculation if there's data
        const revenue = document.getElementById('companyRevenue')?.value;
        if (revenue && parseFloat(revenue) > 0) {
            calculateRisk();
        }
    },
    
    startAutoUpdate() {
        // Update immediately on load
        this.updateMXNRate();
        
        // Then update every 5 minutes
        setInterval(() => {
            this.updateMXNRate();
        }, this.UPDATE_INTERVAL);
    },
    
    manualRefresh() {
        this.updateMXNRate();
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    FX_RATES.startAutoUpdate();
});
