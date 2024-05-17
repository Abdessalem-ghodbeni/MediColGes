// routers/dataImportRoutes.js

const express = require('express');
const router = express.Router();
const dataImportController = require('../controllers/dataImportController');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep the original file name
  }
});
const upload = multer({ storage: storage });

// Route for handling CSV file uploads
router.post('/upload', upload.single('file'), dataImportController.upload);

module.exports = router;
