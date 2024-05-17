// controllers/dataInsightController.js

const analyzeData = (data) => {
    const insights = {
        dataCleaningSuggestions: {},
        dataTransformationSuggestions: {},
        potentialUses: {}
    };

    Object.keys(data).forEach(key => {
        const value = data[key];
        const valueType = typeof value;

        // Data Cleaning
        if (value === null || value === undefined || value === "") {
            insights.dataCleaningSuggestions[key] = "Missing data detected. Consider imputation or removal.";
        }

        // Data Transformation
        if (valueType === 'string') {
            if (/\d{4}-\d{2}-\d{2}/.test(value)) { // Simple check for date-like strings
                insights.dataTransformationSuggestions[key] = "String looks like a date. Consider converting to a Date object.";
                insights.potentialUses[key] = "Can be used for time series analysis or age calculations.";
            } else {
                insights.dataTransformationSuggestions[key] = "String detected. Consider encoding if categorical.";
            }
        } else if (valueType === 'number') {
            insights.dataTransformationSuggestions[key] = "Numeric data detected. Consider normalization or standardization.";
            insights.potentialUses[key] = "Suitable for statistical analysis or input into numeric models.";
        }

        // Data Uses Based on Content
        if (key.toLowerCase().includes("email")) {
            insights.potentialUses[key] = "Can be used for communication or identification purposes.";
        }
    });

    return insights;
};

const dataInsightController = async (req, res) => {
    try {
        const data = req.body;
        const insights = analyzeData(data);
        res.status(200).json({
            success: true,
            message: "Data analysis completed successfully.",
            insights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing data",
            error: error.message
        });
    }
};

module.exports = {
    dataInsightController
};
