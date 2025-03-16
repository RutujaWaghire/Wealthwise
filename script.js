// Global Variables
let portfolioData = {
    totalValue: 45250.00,
    dailyChange: 350.75,
    dailyChangePercentage: 0.78,
    totalAssets: 15,
    assets: {
        stocks: 8,
        crypto: 4,
        etfs: 3
    }
};

let transactions = [
    { type: 'buy', symbol: 'AAPL', amount: 2500, shares: 15, price: 166.67, date: '2025-03-15 14:30:00' },
    { type: 'sell', symbol: 'TSLA', amount: 1800, shares: 8, price: 225.00, date: '2025-03-14 09:45:00' },
    { type: 'buy', symbol: 'BTC', amount: 5000, shares: 0.12, price: 41666.67, date: '2025-03-13 16:20:00' }
];

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
    startRealTimeUpdates();
    updateDateTime();
});

// Initialize Dashboard
function initializeDashboard() {
    updatePortfolioSummary();
    initializeCharts();
    updateTransactionsList();
    updateTopPerformers();
    setupThemeToggle();
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

    // Time filter buttons
    document.querySelectorAll('.time-filter').forEach(button => {
        button.addEventListener('click', (e) => {
            updateTimeFilter(e.target);
        });
    });

    // Period selector for top performers
    document.querySelector('.period-selector').addEventListener('change', (e) => {
        updateTopPerformers(e.target.value);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

// Update Portfolio Summary
function updatePortfolioSummary() {
    // Update total value
    document.querySelector('.total-value .card-info h2').textContent = 
        formatCurrency(portfolioData.totalValue);

    // Update daily profit/loss
    const dailyProfitElement = document.querySelector('.daily-profit .card-info h2');
    const dailyChangeElement = document.querySelector('.daily-profit .change');
    
    dailyProfitElement.textContent = formatCurrency(portfolioData.dailyChange, true);
    dailyChangeElement.textContent = `${portfolioData.dailyChangePercentage}% today`;
    dailyChangeElement.className = `change ${portfolioData.dailyChange >= 0 ? 'positive' : 'negative'}`;

    // Update asset distribution
    document.querySelector('.assets-distribution').textContent = 
        `${portfolioData.assets.stocks} Stocks • ${portfolioData.assets.crypto} Crypto • ${portfolioData.assets.etfs} ETFs`;
}

// Initialize Charts
function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    window.performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: 'Portfolio Value',
                data: generatePerformanceData(30),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Value: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Asset Allocation Chart
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    window.allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Cryptocurrency', 'ETFs'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#a855f7'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            cutout: '75%'
        }
    });
}

// Update Transactions List
function updateTransactionsList() {
    const transactionList = document.querySelector('.transaction-list');
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction';
        transactionEl.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-type ${transaction.type}">${transaction.type.toUpperCase()}</span>
                <span class="transaction-asset">${transaction.symbol}</span>
            </div>
            <div class="transaction-details">
                <span class="transaction-amount">${formatCurrency(transaction.amount)}</span>
                <span class="transaction-date">${formatDate(transaction.date)}</span>
            </div>
        `;
        transactionList.appendChild(transactionEl);
    });
}

// Update Top Performers
function updateTopPerformers(period = 'day') {
    const performersList = document.querySelector('.performers-list');
    performersList.innerHTML = '';

    // Simulate top performers data
    const performers = getTopPerformers(period);
    
    performers.forEach(performer => {
        const performerEl = document.createElement('div');
        performerEl.className = 'performer-item';
        performerEl.innerHTML = `
            <div class="performer-info">
                <span class="performer-symbol">${performer.symbol}</span>
                <span class="performer-name">${performer.name}</span>
            </div>
            <div class="performer-change ${performer.change >= 0 ? 'positive' : 'negative'}">
                ${performer.change >= 0 ? '+' : ''}${performer.change}%
            </div>
        `;
        performersList.appendChild(performerEl);
    });
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update date/time every second
    setInterval(updateDateTime, 1000);

    // Simulate real-time price updates every 5 seconds
    setInterval(() => {
        updatePortfolioValue();
        updateCharts();
    }, 5000);
}

// Update DateTime
function updateDateTime() {
    const now = new Date();
    const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
    document.querySelector('.current-datetime').textContent = formatted + ' UTC';
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    // Update charts theme
    updateChartsTheme(isDark ? 'light' : 'dark');
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Utility Functions
function formatCurrency(value, showPlus = false) {
    const sign = value >= 0 && showPlus ? '+' : '';
    return sign + '$' + value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mock Data Generators
function generateDateLabels(days) {
    const labels = [];
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

function generatePerformanceData(days) {
    let value = 40000;
    const data = [];
    for (let i = 0; i <= days; i++) {
        value = value * (1 + (Math.random() - 0.5) * 0.02);
        data.push(value);
    }
    return data;
}

function getTopPerformers(period) {
    // Mock data - in real app, this would come from an API
    return [
        { symbol: 'AAPL', name: 'Apple Inc.', change: 2.5 },
        { symbol: 'MSFT', name: 'Microsoft', change: 1.8 },
        { symbol: 'GOOGL', name: 'Alphabet', change: -0.5 },
        { symbol: 'AMZN', name: 'Amazon', change: 1.2 }
    ];
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
}

// Add this after the existing code in script.js

// Enhanced Portfolio Performance Chart
function initializePerformanceChart() {
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const gradient = performanceCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const performanceData = {
        monthly: generatePerformanceData(30),
        weekly: generatePerformanceData(7),
        daily: generatePerformanceData(24, 'hourly'),
        yearly: generatePerformanceData(12, 'monthly'),
        all: generatePerformanceData(365)
    };

    window.performanceChart = new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: generateDateLabels(30),
            datasets: [{
                label: 'Portfolio Value',
                data: performanceData.monthly,
                borderColor: '#6366f1',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#6366f1',
                pointHoverBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointHoverBorderColor: '#ffffff',
                pointBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Value: ${formatCurrency(context.raw)}`;
                        },
                        title: function(context) {
                            return `${context[0].label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        display: true,
                        drawBorder: false,
                        color: 'rgba(226, 232, 240, 0.2)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        padding: 10
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Add event listeners for time filter buttons
    document.querySelectorAll('.time-filter').forEach(button => {
        button.addEventListener('click', (e) => {
            const period = e.target.textContent.toLowerCase();
            updatePerformanceChart(period);
            // Update active state
            document.querySelectorAll('.time-filter').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

// Enhanced Asset Allocation Chart
function initializeAllocationChart() {
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    const allocationData = {
        labels: ['Stocks', 'Cryptocurrency', 'ETFs', 'Bonds', 'Commodities'],
        datasets: [{
            data: [45, 25, 15, 10, 5],
            backgroundColor: [
                '#6366f1', // Primary
                '#8b5cf6', // Purple
                '#06b6d4', // Cyan
                '#10b981', // Green
                '#f59e0b'  // Yellow
            ],
            borderWidth: 0,
            borderRadius: 4
        }]
    };

    window.allocationChart = new Chart(allocationCtx, {
        type: 'doughnut',
        data: allocationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${percentage}% (${formatCurrency(value * 1000)})`;
                        }
                    }
                }
            },
            cutout: '75%'
        }
    });

    // Add allocation legend with values
    updateAllocationLegend(allocationData);
}

// Enhanced Top Performers Section
function updateTopPerformers(period = 'day') {
    const performersList = document.querySelector('.performers-list');
    const performers = getEnhancedTopPerformers(period);
    
    performersList.innerHTML = performers.map(performer => `
        <div class="performer-item">
            <div class="performer-info">
                <img src="${performer.icon}" alt="${performer.symbol}" class="performer-icon">
                <div class="performer-details">
                    <span class="performer-symbol">${performer.symbol}</span>
                    <span class="performer-name">${performer.name}</span>
                </div>
            </div>
            <div class="performer-data">
                <span class="performer-price">${formatCurrency(performer.price)}</span>
                <span class="performer-change ${performer.change >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-${performer.change >= 0 ? 'caret-up' : 'caret-down'}"></i>
                    ${Math.abs(performer.change)}%
                </span>
            </div>
        </div>
    `).join('');

    // Add sparkline charts for each performer
    performers.forEach((performer, index) => {
        const sparklineCanvas = document.createElement('canvas');
        sparklineCanvas.id = `sparkline-${index}`;
        sparklineCanvas.height = 30;
        const performerItem = performersList.children[index];
        performerItem.querySelector('.performer-data').appendChild(sparklineCanvas);
        
        createSparkline(sparklineCanvas.id, performer.sparklineData, performer.change >= 0);
    });
}

// Helper function to create sparkline charts
function createSparkline(canvasId, data, isPositive) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: new Array(data.length).fill(''),
            datasets: [{
                data: data,
                borderColor: isPositive ? '#10b981' : '#ef4444',
                borderWidth: 1.5,
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
}

// Helper function to get enhanced top performers data
function getEnhancedTopPerformers(period) {
    return [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 166.67,
            change: 2.5,
            icon: 'https://storage.googleapis.com/iex/api/logos/AAPL.png',
            sparklineData: generateSparklineData(2.5)
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft',
            price: 285.50,
            change: 1.8,
            icon: 'https://storage.googleapis.com/iex/api/logos/MSFT.png',
            sparklineData: generateSparklineData(1.8)
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet',
            price: 125.30,
            change: -0.5,
            icon: 'https://storage.googleapis.com/iex/api/logos/GOOGL.png',
            sparklineData: generateSparklineData(-0.5)
        },
        {
            symbol: 'AMZN',
            name: 'Amazon',
            price: 102.80,
            change: 1.2,
            icon: 'https://storage.googleapis.com/iex/api/logos/AMZN.png',
            sparklineData: generateSparklineData(1.2)
        }
    ];
}

// Helper function to generate sparkline data
function generateSparklineData(trend) {
    const points = 12;
    const data = [];
    let value = 100;
    
    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.5) * 4 + (trend / points);
        data.push(value);
    }
    
    return data;
}

// Update the allocation legend with values
function updateAllocationLegend(data) {
    const legendContainer = document.querySelector('.allocation-legend');
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
    
    legendContainer.innerHTML = data.labels.map((label, index) => {
        const value = data.datasets[0].data[index];
        const percentage = ((value / total) * 100).toFixed(1);
        return `
            <div class="legend-item">
                <div class="legend-marker" style="background-color: ${data.datasets[0].backgroundColor[index]}"></div>
                <div class="legend-label">${label}</div>
                <div class="legend-value">
                    <span class="percentage">${percentage}%</span>
                    <span class="amount">${formatCurrency(value * 1000)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Add this to your existing initialization code
function initializeDashboard() {
    updatePortfolioSummary();
    initializePerformanceChart();
    initializeAllocationChart();
    updateTopPerformers();
    setupThemeToggle();
}
