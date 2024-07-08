document.getElementById('stablecoin-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const stablecoinInput = document.getElementById('stablecoin').value.toLowerCase().trim();
    showLoadingScreen(stablecoinInput);
});

function showLoadingScreen(stablecoinInput) {
    const formContainer = document.querySelector('.form-container');
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = document.getElementById('loading-text');
    const loadingText2 = document.getElementById('loading-text-2');
    const resultDiv = document.getElementById('result');
    const infoContainer = document.getElementById('info-container');
    const submitButton = document.querySelector('button[type="submit"]');
    const backButton = document.querySelector('.back-button');

    const stablecoinNames = {
        'tether': 'USDT',
        'usd-coin': 'USDC',
        'dai': 'DAI'
    };

    if (!stablecoinNames[stablecoinInput]) {
        alert('Invalid stablecoin. Please enter Tether, USD Coin, or DAI.');
        return;
    }

    formContainer.style.display = 'none';
    loadingContainer.style.display = 'flex';
    loadingText.style.display = 'block';
    loadingText2.style.display = 'block';
    submitButton.disabled = true;

    const loadingMessages = [
        `Fetching ${stablecoinNames[stablecoinInput]} total minted information from Ethereum mainnet...`,
        `Fetching ${stablecoinNames[stablecoinInput]} total minted information Tron mainnet...`
    ];

    let messageIndex = 0;
    loadingText.textContent = loadingMessages[messageIndex];
    loadingText2.textContent = `Fetching ${stablecoinNames[stablecoinInput]} collateral information from Custodian A...`;

    const loadingInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        loadingText.textContent = loadingMessages[messageIndex];
        loadingText2.textContent = messageIndex === 0 ?
            `Fetching ${stablecoinNames[stablecoinInput]} collateral information from Custodian A...` :
            `Fetching ${stablecoinNames[stablecoinInput]} collateral information from Custodian B...`;
    }, 2500);

    setTimeout(() => {
        clearInterval(loadingInterval);
        try {
            const currentYear = new Date().getFullYear();

            const timeSeriesData = {
                labels: [`January ${currentYear}`, `February ${currentYear}`, `March ${currentYear}`, `April ${currentYear}`, `May ${currentYear}`, `June ${currentYear}`],
                datasets: [
                    {
                        label: 'Total Collateral',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: [2.3, 2.45, 2.55, 2.65, 2.75, 2.85] // Values in billions
                    },
                    {
                        label: 'Total Minted',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        data: [2.35, 2.5, 2.6, 2.7, 2.8, 2.9] // Values in billions
                    }
                ]
            };

            const ctx = document.getElementById('collateralChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: timeSeriesData,
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return value + ' billion';
                                }
                            }
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.yLabel + ' billion';
                            }
                        }
                    }
                }
            });

            const data = {
                'tether': {
                    minted: {
                        ethereum: {
                            minted: '30,000,000,000 USDT',
                            blockchainNumber: '0x1234...abcd'
                        },
                        tron: {
                            minted: '10,000,000,000 USDT',
                            blockchainNumber: '0x5678...efgh'
                        },
                        totalMinted: '40,000,000,000 USDT'
                    },
                    custodian: {
                        a: {
                            cash: '$10,000,010,000',
                            crypto: '$30,000,000,000'
                        },
                        b: {
                            corpBond: '$90,000',
                            usBond: '$10,000,000,000'
                        },
                        totalCollateral: '$50,000,100,000'
                    }
                },
                'usd-coin': {
                    minted: {
                        ethereum: {
                            minted: '19,000,000,000',
                            blockchainNumber: '0x9abc...def0'
                        },
                        tron: {
                            minted: '1,000,000,000',
                            blockchainNumber: '0x1234...5678'
                        },
                        totalMinted: '20,000,000,000'
                    },
                    custodian: {
                        a: {
                            cash: '$10,000,000,000',
                            crypto: '$10,000,000,000'
                        },
                        b: {
                            corpBond: '$8,000,000,000',
                            usBond: '$1,000,000,000'
                        },
                        totalCollateral: '$31,000,000,000'
                    }
                },
                'dai': {
                    minted: {
                        ethereum: {
                            minted: '19,000,000,000',
                            blockchainNumber: '0x9876...5432'
                        },
                        tron: {
                            minted: '1,000,000,000',
                            blockchainNumber: '0x5678...1234'
                        },
                        totalMinted: '20,000,000,000'
                    },
                    custodian: {
                        a: {
                            cash: '$1,000,000,000',
                            crypto: '$5,000,000,000'
                        },
                        b: {
                            corpBond: '$1,000,000,000',
                            usBond: '$5,005,000,000'
                        },
                        totalCollateral: '22,005,000,000'
                    }
                }
            };

            const selectedData = data[stablecoinInput];

            // Populate minted information
            // Removed Ethereum and Tron minted details as requested
            document.getElementById('total-minted').textContent = selectedData.minted.totalMinted;

            // Populate custodian information
            document.getElementById('custodian-a-cash').textContent = selectedData.custodian.a.cash;
            document.getElementById('custodian-a-crypto').textContent = selectedData.custodian.a.crypto;
            document.getElementById('custodian-b-corp-bond').textContent = selectedData.custodian.b.corpBond;
            document.getElementById('custodian-b-us-bond').textContent = selectedData.custodian.b.usBond;
            document.getElementById('total-collateral-value').textContent = selectedData.custodian.totalCollateral;

            // Hide loading container and show result container
            loadingContainer.style.display = 'none';
            resultDiv.style.display = 'flex';
            infoContainer.style.display = 'flex';
            backButton.style.display = 'block';

            // Update the chart data dynamically
            const totalCollateral = selectedData.custodian.totalCollateral.match(/\d+/g).join('');
            const totalMinted = selectedData.minted.totalMinted.match(/\d+/g).join('');

            // Update the datasets in the chart
            const chartInstance = Chart.getChart('collateralChart');
            chartInstance.data.datasets[0].data = Array(6).fill(Number(totalCollateral) / 1e9); // Example: 40B USDT -> 40
            chartInstance.data.datasets[1].data = Array(6).fill(Number(totalMinted) / 1e9); // Example: 40B USDT -> 40
            chartInstance.update();

        } catch (error) {
            console.error('An error occurred while processing the request:', error);
            alert('An error occurred while processing your request. Please try again.');
        } finally {
            submitButton.disabled = false;
        }
    }, 5000);
}

document.querySelector('.back-button').addEventListener('click', function () {
    const formContainer = document.querySelector('.form-container');
    const loadingContainer = document.getElementById('loading-container');
    const resultDiv = document.getElementById('result');
    const infoContainer = document.getElementById('info-container');
    const backButton = document.querySelector('.back-button');

    formContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
    resultDiv.style.display = 'none';
    infoContainer.style.display = 'none';
    backButton.style.display = 'none';
});
