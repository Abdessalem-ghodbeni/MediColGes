const express = require("express");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const cors = require("cors"); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 3004;

const PAT = 'f70a8ba8669544fbaf7bcf80cdd93073';
const USER_IDC = 'clarifai';
const APP_IDC = 'main';
const MODEL_IDC = 'moderation-multilingual-text-classification';
const MODEL_VERSION_IDC = '79c2248564b0465bb96265e0c239352b';

app.use(express.json());
app.use(cors()); // Enable CORS

// Define the POST endpoint for predictions
app.post("/predict", (req, res) => {
    const { text } = req.body;

    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs({
        user_app_id: {
            "user_id": USER_IDC,
            "app_id": APP_IDC
        },
        model_id: MODEL_IDC,
        version_id: MODEL_VERSION_IDC,
        inputs: [
            {
                "data": {
                    "text": {
                        "raw": text
                    }
                }
            }
        ]
    }, metadata, (err, response) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (response.status.code !== 10000) {
            return res.status(400).json({ error: "Post model outputs failed, status: " + response.status.description });
        }

        const output = response.outputs[0];
        const predictedConcepts = output.data.concepts.map(concept => ({ name: concept.name, value: concept.value }));
        
        // Send back the predicted concepts in the response
        res.json({ predictedConcepts });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
