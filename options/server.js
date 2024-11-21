const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});

// Endpoint to fetch calorie information
app.get('/calories', async (req, res) => {
    const food = req.query.food;

    if (!food) {
        return res.status(400).json({ error: 'No food item specified' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const searchQuery = `calories in 100g of ${food}`;
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);

        // Extract the first snippet that contains calorie data
        const calories = await page.evaluate(() => {
            const result = document.querySelector('.BNeawe.iBp4i.AP7Wnd');
            return result ? result.textContent : null;
        });

        await browser.close();

        if (calories) {
            res.json({ food, calories });
        } else {
            res.status(404).json({ error: 'Calorie information not found' });
        }
    } catch (error) {
        await browser.close();
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching calorie information' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
