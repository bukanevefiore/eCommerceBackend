import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import { fetchGoldPriceUSDGram } from "./services/goldPriceService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/products", async (req, res) => {
    try {
        const productData = await fs.readFile("./products.json", "utf-8");
        const products = JSON.parse(productData);

        const goldPrice = await fetchGoldPriceUSDGram();

        let updatedData = products.map((p) => {
            const price = (p.popularityScore +1) * p.weight * goldPrice;
            return {
                ...p,
                price: Number(price.toFixed(2)),
                currency: "USD",
                popularityOutValue: Number((p.popularityScore * 5).toFixed(1)),
            };
        });

        console.log("DATA: ", updatedData);

            // FILTERS
        const minPrice = Number(req.query.minPrice) || 0;
        const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        const minPopularity = Number(req.query.minPopularity) || 0;
        const maxPopularity = Number(req.query.maxPopularity) || 5;

         updatedData = updatedData.filter((p) => {
          return (
            p.price >= minPrice &&
            p.price <= maxPrice &&
            p.popularityOutValue >= minPopularity &&
            p.popularityOutValue <= maxPopularity
          );
        });

        console.log(">> Filter Products with Filter:", updatedData);

        res.json({
            succes: true,
            timestamp: new Date().toISOString(),
            data: updatedData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ succes: false, message: "Internal error" });

    }

});

app.listen(PORT, () => {
    console.log(`Backend Api Running at http://localhost:${PORT}/products`);
});