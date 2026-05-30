const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body; // Mensaje que envía el frontend
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", // Modelo de OpenAI que quieres usar
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // La API Key
                    "Content-Type": "application/json",
                }
            }
        );
        res.json(response.data); // Responde con los datos de la API de OpenAI
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
});

module.exports = router;
