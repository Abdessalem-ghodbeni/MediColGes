const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.gemini.com/v1', // Adjust based on actual API URL
  headers: {
    'X-GEMINI-APIKEY': process.env.GEMINI_API_KEY,
    'Content-Type': 'application/json'
  }
});

const fetchMarketData = async () => {
    try {
      const response = await api.get('/pubticker/btcusd');  // Example endpoint for Bitcoin to USD ticker information
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  };
  
module.exports = {
  fetchMarketData
};
