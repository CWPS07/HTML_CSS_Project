const apiURL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

async function fetchCryptoPrices() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        const btcPriceDisplay = document.querySelector('#bitcoin .price');
        const ethPriceDisplay = document.querySelector('#ethereum .price');

        const btcPrice = data.bitcoin.usd.toLocaleString();
        const ethPrice = data.ethereum.usd.toLocaleString();

        btcPriceDisplay.textContent = btcPrice;
        ethPriceDisplay.textContent = ethPrice;

        document.querySelectorAll('.price-display').forEach(el => {
            el.classList.add('pulse');
            setTimeout(() => el.classList.remove('pulse'), 500);
        });

    } catch (error) {
        console.error("Error communicating with data API stream:", error);
    }
}

fetchCryptoPrices();

setInterval(fetchCryptoPrices, 10000);
