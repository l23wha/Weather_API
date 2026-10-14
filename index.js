require('dotenv').config();

const express = require('express');
const axios = require('axios');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// 1. Initialize Redis client
const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

// 2. Rate Limiter Configuration 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: { error: 'Too many requests from this IP, please try again later' }
});

app.use('/weather', limiter);

// 3. Weather Endpoint
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city.toLowerCase().trim();

    try {
        // First check Redis cache
        const cacheData = await redisClient.get(city);
        if (cacheData) {
            return res.status(200).json({
                source: 'cache',
                data: JSON.parse(cacheData)
            });
        }

        // Fetch from 3rd party API 
        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`;

        const response = await axios.get(url);
        const weatherData = response.data;

        // Store in Redis with 12 hours expiration (43200 seconds)
        await redisClient.setEx(city, 43200, JSON.stringify(weatherData));

        return res.status(200).json({
            source: 'api',
            data: weatherData,
        });

    } catch (error) {
        console.error(error.message);
        if (error.response && error.response.status === 400) {
            return res.status(400).json({ error: 'Invalid city name or request parameter' });
        }
        return res.status(500).json({ error: "Internal Server error while fetching weather data" });
    }
});

// 4. Start Server at the very end
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});