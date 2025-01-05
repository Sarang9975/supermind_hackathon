const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = 3001;

// Replace with your actual API details
const API_URL = 'https://api.langflow.astra.datastax.com/lf/5dec3c8d-1033-4122-add3-86b355cffb35/api/v1/run/24c51a14-4ee1-457e-85ae-c8f64bf011a9?stream=false';
const APPLICATION_TOKEN = 'AstraCS:cDXCUZthHfadJXeZwgCgzngh:e082cf44b9e8c5b5869c99461a5ecb1b559965f5c9260a9e258b6ee2a721d7e9';

// Enable CORS for all origins
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const response = await axios.post(API_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APPLICATION_TOKEN}`
      }
    });

    // Forward the API response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error forwarding request to API:', error.message);

    if (error.response) {
      // API responded with an error
      res.status(error.response.status).json({
        error: error.response.data,
        message: error.message,
      });
    } else {
      // Network or other error
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
});

// Start the proxy server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
