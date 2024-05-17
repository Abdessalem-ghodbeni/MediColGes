const express = require("express");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const cors = require("cors");
const cloudinaryMiddleware = require("../middleware/uploadCloudinary1"); // Import your Cloudinary middleware
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3005;
const PAT = 'f70a8ba8669544fbaf7bcf80cdd93073';    
const USER_ID = 'openai';
const APP_ID = 'dall-e';
const MODEL_ID = 'dall-e-3';
const MODEL_VERSION_ID = 'dc9dcb6ee67543cebc0b9a025861b868';

app.use(express.json());
app.use(cors());

app.post("/Generate", async (req, res) => {
    const { text } = req.body;

    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID,
            inputs: [
                {
                    "data": {
                        "text": {
                            "raw": text
                        }
                    }
                }
            ],
        },
        metadata,
        async (err, response) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (response.status.code !== 10000) {
                return res.status(500).json({ error: "Post models failed, status: " + response.status.description });
            }

            const output = response.outputs[0].data.image.base64;
            const filePath = './generated-image.jpg';
            try {
                // Save the generated image locally
                const localImagePath = "generated-image.jpg";
                fs.writeFileSync(localImagePath, Buffer.from(output, 'base64'));
                console.log('Saved image locally:', localImagePath);

                // Upload the generated image to Cloudinary
                cloudinaryMiddleware.uploadFile(filePath)
                    .then(result => {
                        console.log('Image uploaded to Cloudinary:', result.secure_url);
                        // Now that the upload is complete, return the response
                        return res.status(200).json({ cloudinaryURL: result.secure_url, localPath: localImagePath });
                    })
                    .catch(error => {
                        console.error('Error uploading image to Cloudinary:', error);
                        return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
                    });
            } catch (error) {
                console.error("Error saving image locally:", error);
                return res.status(500).json({ error: "Failed to save image locally" });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
