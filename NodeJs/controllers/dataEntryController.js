const DataEntry = require('../models/dataEntry');

// POST: Create a new data entry
exports.createDataEntry = async (req, res) => {
    try {
        const dataEntry = new DataEntry(req.body);
        await dataEntry.save();
        res.status(201).send(dataEntry);
    } catch (error) {
        res.status(400).send(error);
    }
};

// GET: Retrieve all data entries
exports.getAllDataEntries = async (req, res) => {
    try {
        const dataEntries = await DataEntry.find();
        res.send(dataEntries);
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET: Retrieve a single data entry by ID
exports.getDataEntryById = async (req, res) => {
    try {
        const dataEntry = await DataEntry.findById(req.params.id);
        if (!dataEntry) {
            return res.status(404).send();
        }
        res.send(dataEntry);
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET: Retrieve data entries by user ID
exports.getDataEntriesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const dataEntries = await DataEntry.find({ user_id: userId });
        res.send(dataEntries);
    } catch (error) {
        res.status(500).send(error);
    }
};

// PUT: Update a data entry
exports.updateDataEntry = async (req, res) => {
    try {
        const dataEntry = await DataEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dataEntry) {
            return res.status(404).send();
        }
        res.send(dataEntry);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Delete a data entry
exports.deleteDataEntry = async (req, res) => {
    try {
        const dataEntry = await DataEntry.findByIdAndDelete(req.params.id);
        if (!dataEntry) {
            return res.status(404).send();
        }
        res.send(dataEntry);
    } catch (error) {
        res.status(500).send(error);
    }
};
