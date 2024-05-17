const ResponseModel = require("../models/Reponse.model.js");
const Forms = require("../models/forms.model.js");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const FormField = require("../models/formField.model.js");
const cloudinary = require("cloudinary").v2;
const { getDataUri } = require("./../utils/features.js");
const FormFiledModel = require("../models/formField.model.js");
const cloudinaryUploader = require("cloudinary");
const userModel = require("../models/userModel.js");
const singleUpload = require("../middleware/multer.js").singleUpload;

//Blockchain
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.API_URL_BLOCKCHAIN
);
const {
  abi,
} = require("../artifacts/contracts/contractApi.sol/contractApi.json");
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY_BLOCKCHAIN, provider);
// const contractInstance = new ethers.Contract(
//   process.env.CONTRACT_ADDRESS,
//   abi,
//   signer
// );

//cloudinary Config
cloudinary.config({
  cloud_name: "dqyyvvwap",
  api_key: "829332458549452",
  api_secret: "F4akaK4kP3eSh4cSjM-36tSbF60",
});

module.exports.AjouterResponseBlockchain = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);

    if (!user || !user.ethereumPrivateKey) {
      return res.status(404).json({ success: false, message: "User not found or Ethereum key missing" });
    }

    const signer = new ethers.Wallet(user.ethereumPrivateKey, provider);
    const contractInstance = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    const formId = req.body.form;
    const form = await Forms.findOne({ _id: formId });
    if (!form) {
      return res.status(404).json({ error: "Form does not exist in the database" });
    }

    const responseAnswers = [];
    for (const answer of req.body.answers) {
      const fieldId = answer.field;
      const field = await FormField.findOne({ _id: fieldId });
      if (!field) {
        return res.status(404).json({ error: "Field does not exist in the database" });
      }
      responseAnswers.push({
        field: fieldId,
        value: answer.value,
      });
    }

    const newResp = await ResponseModel.create({
      form: formId,
      answers: responseAnswers,
      user: userId,
    });

    // Save the response to the database
    const rep = await newResp.save();
    if (form) {
      form.addResponse(rep._id);
      await form.save();
    }
    await user.ResponsesListe.push(rep._id);
    await user.save();

    // Enregistrement dans la blockchain
    const responseData = JSON.stringify(responseAnswers);
    const tx = await contractInstance.addResponse(formId, responseData);
    await tx.wait();

    res.status(201).json({ message: "Response saved successfully", rep });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something was wrong" });
  }
};

module.exports.getAllResponseBlockchain = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if Ethereum address is available instead of private key
    if (!user.ethereumAddress) {
      return res.status(404).json({ success: false, message: "Ethereum address is missing" });
    }

    const signer = new ethers.Wallet(user.ethereumPrivateKey, provider);
    const contractInstance = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    // Fetching all responses
    const blockchainResponses = await contractInstance.getAllResponses();
    const formattedResponses = blockchainResponses.map(response => ({
      formId: response.formId,
      respondent: response.respondent,
      responseData: JSON.parse(response.responseData) // Assuming responseData is a JSON string
    }));

    // Enrich data from MongoDB
    for (let response of formattedResponses) {
      const formDetails = await Forms.findById(response.formId);
      const userDetails = await userModel.findOne({ ethereumAddress: response.respondent });
      response.formDetails = formDetails ? formDetails : null;
      response.userDetails = userDetails ? userDetails : null;
    }

    res.json(formattedResponses);
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    res.status(500).json({
      message: "Failed to retrieve responses from the blockchain",
      error: error.toString(),
    });
  }
};


module.exports.getAllResponseByIdFormBlockchain = async (req, res) => {
  const { formId } = req.params;
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if Ethereum address is available instead of private key
    if (!user.ethereumAddress) {
      return res.status(404).json({ success: false, message: "Ethereum address is missing" });
    }

    const signer = new ethers.Wallet(user.ethereumPrivateKey, provider);
    const contractInstance = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    
    const responses = await contractInstance.getResponsesByForm(formId);
    const formattedResponses = responses.map((response) => ({
      formId: response.formId,
      respondent: response.respondent,
      responseData: response.responseData,
    }));
    res.json(formattedResponses);
  } catch (error) {
    console.error("Failed to fetch responses for the form:", error);
    res
      .status(500)
      .json({
        error: "Failed to retrieve responses from the blockchain",
        details: error.message,
      });
  }
};

module.exports.UploadFileInCloudinary = async (req, res) => {
  try {
    // const { name } = req.body;
    const file = getDataUri(req.file);
    const cdb = await cloudinary.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    res.status(201).send({
      success: true,
      message: "cloudinary Created Successfully",
      url: cdb.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "somthing was warrning",
    });
  }
};