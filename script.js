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
    const mintedInfoTitle = document.getElementById('minted-info-title');

    const stablecoinNames = {
        'tether': 'USDT',
        'usd-coin': 'USDC',
        'dai': 'DAI'
    };

    if (!stablecoinNames[stablecoinInput]) {
        alert('Invalid stablecoin. Please enter Tether, USD Coin, or DAI.');
        return;
    }

    mintedInfoTitle.textContent = `Minted Information for ${stablecoinNames[stablecoinInput]}`;

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
                datasets: []
            };

            const data = {
                'tether': {
                    minted: {
                        ethereum: {
                            minted: '22,000,000,000 USDT',
                            blockchainNumber: '0x1234...abcd'
                        },
                        tron: {
                            minted: '18,000,000,000 USDT',
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
                            usBond: '$1,910,000,000'
                        },
                        totalCollateral: '$40,500,000,000'
                    },
                    chartData: {
                        totalCollateral: [40.5, 40.7, 40.8, 40.6, 40.7, 40.8],
                        totalMinted: [40.0, 40.1, 40.2, 40.0, 40.1, 40.2]
                    }
                },
                'usd-coin': {
                    minted: {
                        ethereum: {
                            minted: '22,000,000,000 USDC',
                            blockchainNumber: '0x9abc...def0'
                        },
                        tron: {
                            minted: '10,000,000,000 USDC',
                            blockchainNumber: '0x1234...5678'
                        },
                        totalMinted: '32,000,000,000'
                    },
                    custodian: {
                        a: {
                            cash: '$10,000,000,000',
                            crypto: '$10,000,000,000'
                        },
                        b: {
                            corpBond: '$8,000,000,000',
                            usBond: '$4,500,000,000'
                        },
                        totalCollateral: '$32,500,000,000'
                    },
                    chartData: {
                        totalCollateral: [32.0, 32.2, 32.4, 32.1, 32.3, 32.5],
                        totalMinted: [32.0, 32.1, 32.2, 32.0, 32.1, 32.2]
                    }
                },
                'dai': {
                    minted: {
                        ethereum: {
                            minted: '15,000,000,000 DAI',
                            blockchainNumber: '0x9876...5432'
                        },
                        tron: {
                            minted: '13,000,000,000 DAI',
                            blockchainNumber: '0x5678...1234'
                        },
                        totalMinted: '28,000,000,000'
                    },
                    custodian: {
                        a: {
                            cash: '$1,000,000,000',
                            crypto: '$5,000,000,000'
                        },
                        b: {
                            corpBond: '$1,000,000,000',
                            usBond: '$22,000,000,000'
                        },
                        totalCollateral: '$29,000,000,000'
                    },
                    chartData: {
                        totalCollateral: [29.0, 29.1, 29.2, 29.0, 29.1, 29.2],
                        totalMinted: [28.0, 28.1, 28.2, 28.0, 28.1, 28.2]
                    }
                }
            };

            const selectedData = data[stablecoinInput];

            // Populate minted information
            document.getElementById('eth-minted').textContent = selectedData.minted.ethereum.minted;
            document.getElementById('eth-blockchain-number').textContent = selectedData.minted.ethereum.blockchainNumber;
            document.getElementById('tron-minted').textContent = selectedData.minted.tron.minted;
            document.getElementById('tron-blockchain-number').textContent = selectedData.minted.tron.blockchainNumber;
            document.getElementById('total-minted').textContent = selectedData.minted.totalMinted;

            // Populate custodian information
            document.getElementById('custodian-a-cash').textContent = selectedData.custodian.a.cash;
            document.getElementById('custodian-a-crypto').textContent = selectedData.custodian.a.crypto;
            document.getElementById('custodian-b-corp-bond').textContent = selectedData.custodian.b.corpBond;
            document.getElementById('custodian-b-us-bond').textContent = selectedData.custodian.b.usBond;
            document.getElementById('total-collateral-value').textContent = selectedData.custodian.totalCollateral;

            // Set chart data for the selected stablecoin
            const chartContainerUSDT = document.getElementById('collateralChartUSDT').getContext('2d');
            const chartContainerUSDC = document.getElementById('collateralChartUSDC').getContext('2d');
            const chartContainerDAI = document.getElementById('collateralChartDAI').getContext('2d');

            const chartConfigs = {
                'tether': {
                    element: chartContainerUSDT,
                    data: {
                        labels: timeSeriesData.labels,
                        datasets: [
                            {
                                label: 'Total Collateral',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                data: selectedData.chartData.totalCollateral
                            },
                            {
                                label: 'Total Minted',
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                data: selectedData.chartData.totalMinted
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 38,
                                max: 42,
                                ticks: {
                                    stepSize: 1,
                                    callback: function (value) {
                                        return value + ' billion';
                                    }
                                }
                            }
                        }
                    }
                },
                'usd-coin': {
                    element: chartContainerUSDC,
                    data: {
                        labels: timeSeriesData.labels,
                        datasets: [
                            {
                                label: 'Total Collateral',
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                data: selectedData.chartData.totalCollateral
                            },
                            {
                                label: 'Total Minted',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                data: selectedData.chartData.totalMinted
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 30,
                                max: 34,
                                ticks: {
                                    stepSize: 2,
                                    callback: function (value) {
                                        return value + ' billion';
                                    }
                                }
                            }
                        }
                    }
                },
                'dai': {
                    element: chartContainerDAI,
                    data: {
                        labels: timeSeriesData.labels,
                        datasets: [
                            {
                                label: 'Total Collateral',
                                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                data: selectedData.chartData.totalCollateral
                            },
                            {
                                label: 'Total Minted',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                data: selectedData.chartData.totalMinted
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                min: 27,
                                max: 31,
                                ticks: {
                                    stepSize: 2,
                                    callback: function (value) {
                                        return value + ' billion';
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // Create the chart for the selected stablecoin
            const chartConfig = chartConfigs[stablecoinInput];
            new Chart(chartConfig.element, {
                type: 'line',
                data: chartConfig.data,
                options: chartConfig.options
            });

            // Show the relevant chart
            document.getElementById('collateralChartUSDT').style.display = stablecoinInput === 'tether' ? 'block' : 'none';
            document.getElementById('collateralChartUSDC').style.display = stablecoinInput === 'usd-coin' ? 'block' : 'none';
            document.getElementById('collateralChartDAI').style.display = stablecoinInput === 'dai' ? 'block' : 'none';

            // Hide loading container and show result container
            loadingContainer.style.display = 'none';
            resultDiv.style.display = 'flex';
            infoContainer.style.display = 'flex';
            backButton.style.display = 'block';

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
