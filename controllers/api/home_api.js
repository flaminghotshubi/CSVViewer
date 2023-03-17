const CSVFile = require('../../models/file');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

//multer implementation - https://www.educative.io/answers/how-to-handle-file-upload-in-expressjs
//validation tutorial: https://www.positronx.io/multer-file-type-validation-tutorial-with-example/#:~:text=The%20fileFilter%20method%20is%20a,cb%20middlewares%20with%20fileFilter%20method.&text=Declare%20the%20if%20statement%20along,mimetype%20options.
// Import multer like the other dependencies
const multer = require('multer')
// Set multer file storage folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}).single('csvfile');

module.exports.home = async function (req, res) {
    let files = await CSVFile.find({}).sort({'createdAt':-1}).select('name id')
    return res.status(200).json({
        message: 'Welcome to CSV Viewer! Here are the list of csv files available for viewing. Please use the id for viewing',
        files: files
    })
}

module.exports.uploadFile = function(req, res) {
    upload(req, res, async function (err) {
        if (err) {
            // A Multer error occurred when uploading.
            console.log('multer error: ', err);
        } else {
            if (req.file) {
                await CSVFile.create({
                    name: req.file.originalname,
                    filePath: req.file.path,
                    filename: req.file.filename
                })
                let files = await CSVFile.find({}).sort({'createdAt':-1}).select('name id')
                return res.status(200).json({
                    message: 'File uploaded successfully! Here is the updated list of files',
                    files: files
                })
            } else {
                return res.status(200).json({
                    message: 'File Upload Failed! Only .csv format allowed',
                })
            }
        }
    })
}

module.exports.view = async function (req, res) {
    if (req.query.fileId) {
        let uploadedFile = await CSVFile.findById(req.query.fileId);
        if(uploadedFile) {
            let results = [];
            let headerList;
            fs.createReadStream(path.join(__dirname, '../../', 'uploads', uploadedFile.filename))
            .pipe(csv())
            .on('headers', (headers) => {
                headerList = headers
            })
            .on('data', (data) => {
                results.push(Object.values(data))
            })
            .on('end', () => {
                return res.status(200).json({
                    filename: uploadedFile.name,
                    headers: headerList,
                    results: results
                })
            })
        } else {
            return res.status(404).json({
                message: 'File not found!'
            })
        }
    }
}