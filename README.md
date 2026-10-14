# 🌤️ Real-Time Weather API with Redis Caching

A robust, high-performance RESTful Weather API built with **Node.js** and **Express.js**. This backend service fetches live weather data from a 3rd-party weather provider, optimizes performance using **Redis in-memory caching**, and protects against abuse with **Rate Limiting**.

---

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **HTTP Client:** Axios
* **Caching & Database:** Redis (Upstash Cloud)
* **Security & Middleware:** `express-rate-limit`, `dotenv`

---

## ✨ Features

* **3rd-Party API Integration:** Fetches accurate, up-to-date weather forecasts and metrics using the Visual Crossing Weather API.
* **Smart Caching Layer:** Caches city weather responses in Redis with a **12-hour TTL (Time-To-Live)**. Subsequent requests for the same city fetch instantly from the cache, reducing external API calls and latency.
* **Rate Limiting:** Protects endpoints from abuse by restricting IPs to a maximum number of requests per 15-minute window.
* **Robust Error Handling:** Handles invalid city names, bad parameters, and connection failures gracefully with appropriate HTTP status codes.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
WEATHER_API_KEY=your_visual_crossing_api_key
REDIS_URL=rediss://default:your_redis_password@your-redis-endpoint.upstash.io:6379
