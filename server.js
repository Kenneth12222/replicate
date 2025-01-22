require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const replicateApiKey = process.env.REPLICATE_API_KEY;

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.replicate.com/v1/predictions',
            {
                version: "ac08c6bb6a71f2f02e0d4951709d634b1df0a9f3781ac5eefe2c2b293bdae37b", // Replace with the specific model's version ID
                input: {
                    prompt: prompt,
                },
            },
            {
                headers: {
                    Authorization: `Token ${replicateApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

      
        const videoUrl = response.data.output[0]; 
        res.json({ videoUrl });
        
    } catch (error) {
        console.error('Error generating image:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Image generation failed',
            details: error.response ? error.response.data : error.message,
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// 