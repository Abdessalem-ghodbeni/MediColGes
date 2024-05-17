const mongoose = require('mongoose');

const dataEntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileData: {
        fileName: { type: String},
        header: [{ type: String }],
        data: [{ type: Map, of: String }]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model
        // required: true
    }
}, {
    timestamps: true
});

const DataEntry = mongoose.model("DataEntry", dataEntrySchema);
module.exports = DataEntry;