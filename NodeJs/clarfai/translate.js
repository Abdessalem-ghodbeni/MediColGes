
//index.js file

////////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the text we want as an input. Change these strings to run your own example.
/////////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = 'f70a8ba8669544fbaf7bcf80cdd93073';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'helsinkinlp';
const APP_ID = 'translation';
// Change these to whatever model and text URL you want to use
const MODEL_ID = 'text-translation-romance-lang-english';
const MODEL_VERSION_ID = '33110d5751fc4f669b65e95411bd9772';
const RAW_TEXT = 'salut cv toi?';
// To use a hosted text file, assign the url variable
// const TEXT_URL = 'https://samples.clarifai.com/negative_sentence_12.txt';
// Or, to use a local text file, assign the url variable
// const TEXT_FILE_LOCATION = 'YOUR_TEXT_FILE_LOCATION_HERE';

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

stub.PostModelOutputs(
    {
        user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
        inputs: [
            {
                "data": {
                    "text": {
                        "raw": RAW_TEXT
                        // url: TEXT_URL, allow_duplicate_url: true 
                        // raw: fileBytes
                    }
                }
            }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }

        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }

        // Since we have one input, one output will exist here.
        const output = response.outputs[0];

        console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
        }
    }

);
