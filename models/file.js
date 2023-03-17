const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{timestamps: true});

const CSVFile = mongoose.model('CSVFile', fileSchema);
module.exports = CSVFile
