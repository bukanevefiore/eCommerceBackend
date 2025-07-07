import axios from "axios";

export async function fetchGoldPriceUSDGram() {
    try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
            headers: {
                "x-access-token": process.env.GOLD_API_KEY,
            },
        });

        const usdPerOunce = response.data.price;
        return usdPerOunce / 31.1035;

    } catch (error) {
        console.error("Gold price API error, fallback 70 USD/gram used");
        return 70;
    }
}