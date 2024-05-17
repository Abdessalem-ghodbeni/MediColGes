const express = require('express');
const router = express.Router();
const DataAnalysisController = require('../controllers/dataAnalyticsController');

// Initialize the controller with the API key
const apiKey = process.env.GEMINI_API_KEY; // Ensure your API key is loaded from environment variables
const dataAnalysisController = new DataAnalysisController(apiKey);

// Define the route for data analysis
router.post('/analyze-data', dataAnalysisController.analyzeData.bind(dataAnalysisController));

module.exports = router;
