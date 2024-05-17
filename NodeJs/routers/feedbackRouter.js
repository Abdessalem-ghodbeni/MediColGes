const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Define routes for feedback endpoints
router.get('/', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.get('/feedback/latest', feedbackController.getLatestFeedback);
router.post('/', feedbackController.createFeedback);
router.put('/:id', feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);


module.exports = router;
