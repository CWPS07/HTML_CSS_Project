const priceElement = document.getElementById('crypto-price');

async function updatePrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        
        if (!response.ok) throw new Error('Network issue or API limit');
        
        const data = await response.json();
        const usdPrice = data.bitcoin.usd;

        priceElement.innerText = `$${usdPrice.toLocaleString()}`;
        
    } catch (error) {
        priceElement.innerText = "$——,——";
        priceElement.style.color = "#ff2a6d";
        console.error("Error fetching data:", error);
    }
}

window.addEventListener('DOMContentLoaded', updatePrice);

setInterval(updatePrice, 5000);
