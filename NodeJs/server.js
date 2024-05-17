const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const Color = require("colors");
const Web3 = require("web3");
const ethers = require("ethers");
const formsRouter = require("./routers/forms.routes.js");
const ProjectRoutes = require("./routers/Poject.routes.js");
const ResponseRoutes = require("./routers/response.routes.js");
const chatRoute = require("./routers/chatRoute");
const messageRoute = require("./routers/messageRoute");
const multer = require("multer");

require("./db");
require("dotenv").config();
const port = 3000;

app.use(express.json());
app.use(cors());

//chat
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
// Importation des routes
const authentificationRouter = require("./routers/authentificationRouter");
app.use("/authentification", authentificationRouter);

const superAdminRouter = require("./routers/superAdminRouter");
app.use("/superAdmin", superAdminRouter);

const internauteRouter = require("./routers/internauteRouter");
app.use("/internaute", internauteRouter);

const patientRouter = require("./routers/patientRouter");
app.use("/patient", patientRouter);

const organizationRoutes = require("./routers/organizationRoutes");
app.use("/organizations", organizationRoutes);

const subCategoryRoutes = require("./routers/subCategoryRoutes");
app.use("/sub-categories", subCategoryRoutes);

const categoryRoutes = require("./routers/categoryRoutes");
app.use("/categories", categoryRoutes);

const feedbackRouter = require("./routers/feedbackRouter");
app.use("/feedback", feedbackRouter);

const domaineProfessionnelRouter = require("./routers/domaineProfessionnelRouter");
app.use("/domaineProfessionnel", domaineProfessionnelRouter);

const historyRouter = require("./routers/historyRouter");
app.use("/history", historyRouter);

const publicationRouter = require("./routers/publicationRouter");
app.use("/publication", publicationRouter);

const commentaireRouter = require("./routers/commentaireRouter");
app.use("/commentaire", commentaireRouter);

const reponseRouterBlockchain = require("./routers/reponseRouterBlockchain");
app.use("/reponseBlockchain", reponseRouterBlockchain);

app.get("/getImage/:img", function (req, res) {
  res.sendFile(__dirname + "/storage/" + req.params.img);
});

app.use("/forms", formsRouter);
// app.use("/response", responseForms);
app.use("/project", ProjectRoutes);
app.use("/response", ResponseRoutes);

//------------- Begin DataImportController ----------------------------------

// Import data import routes
const dataImportRoutes = require("./routers/dataImportRoutes");
app.use("/data", dataImportRoutes);
const dataEntryRoutes = require("./routers/dataEntryRoutes");
app.use("/dataEntry", dataEntryRoutes);
const analysisRoutes = require('./routers/dataInsightRoutes');
app.use('/api', analysisRoutes);
// app.use('/api', dataAnalysisRoutes);
// router.get('/', dataAnalyzeController.dataAnalyzeController);


//setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//------------- End DataImportController ----------------------------------


// clarifai
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const cloudinaryMiddleware = require("./middleware/uploadCloudinary1"); // Import your Cloudinary middleware
const fs = require("fs");

const PAT = 'f70a8ba8669544fbaf7bcf80cdd93073';    
const USER_ID = 'openai';
const APP_ID = 'dall-e';
const MODEL_ID = 'dall-e-3';
const MODEL_VERSION_ID = 'dc9dcb6ee67543cebc0b9a025861b868';

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

// classification
const USER_IDC = 'clarifai';
const APP_IDC = 'main';
const MODEL_IDC = 'moderation-multilingual-text-classification';
const MODEL_VERSION_IDC = '79c2248564b0465bb96265e0c239352b';

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


// socket
const socketIo = require('socket.io');
const http = require("http");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

      console.log("Online users:", onlineUsers);

      io.emit("getOnlineUsers", onlineUsers);
    }
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected:", socket.id);
    console.log("Online users:", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});


// Démarrage du serveur
server.listen(port, function () {
  console.log(
    `Le serveur est en cours d'exécution, veuillez ouvrir dans votre navigateur à l'adresse http://localhost:${port}`
      .bgYellow.yellow
  );
});
