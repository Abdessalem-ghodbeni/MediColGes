const { GoogleGenerativeAI } = require("@google/generative-ai");

class DataAnalysisController {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzeData(req, res) {
        try {
            const data = req.body;
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

            // You can define several message templates here
            const templates = {
                summary: "Provide a summary of the dataset focusing on key statistics and patterns.",
                detailed: "Detailed analysis including data types, potential data quality issues, and recommendations for preprocessing.",
                outlierDetection: "Detect outliers or anomalies in the dataset and provide insights into their potential causes or implications.",
                correlationAnalysis: "Analyze the correlation between different variables in the dataset to identify relationships and dependencies.",
                visualization: "Suggest types of data visualizations that could effectively represent the data and highlight important trends.",
                errorOrIssue:"suggest  how to make data more clear and some fixes",
            };

            // Choose a template based on a request parameter or internal logic
            const analysisType = req.query.analysisType || 'summary'; // Default to summary if not specified
            const modelMsgJson = templates[analysisType];

            // Formatting the prompt from data
            const prompt = `Analyze this data: ${JSON.stringify(data)}. Please return the analysis with this json format like this: ${modelMsgJson}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            res.status(200).json({
                success: true,
                data: text,
                analysisType: analysisType
            });
        } catch (error) {
            console.error('Failed to process data with Gemini API:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to analyze data',
                error: error.message
            });
        }
    }
}

module.exports = DataAnalysisController;
