const express = require('express');
const router = express.Router();
const dataEntryController = require('../controllers/dataEntryController');

router.post('/', dataEntryController.createDataEntry);
router.get('/', dataEntryController.getAllDataEntries);
router.get('/:id', dataEntryController.getDataEntryById);
router.get('/user/:userId', dataEntryController.getDataEntriesByUserId);
router.put('/:id', dataEntryController.updateDataEntry);
router.delete('/:id', dataEntryController.deleteDataEntry);

module.exports = router;
