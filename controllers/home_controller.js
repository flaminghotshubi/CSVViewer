const CSVFile = require('../models/file');
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
    return res.render('home', {
        files: files
    });
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
                req.flash('success', 'File uploaded successfully!')
            } else {
                req.flash('error', 'Only .csv format allowed!')
            }
        }
        res.redirect('back')
    })
}

module.exports.view = async function (req, res) {
    if (req.query.fileId) {
        let uploadedFile = await CSVFile.findById(req.query.fileId);
        if(uploadedFile) {
            let results = [];
            let headerList;
            let files = await CSVFile.find({}).sort({'createdAt':-1}).select('name id');
            fs.createReadStream(path.join(__dirname, '..', 'uploads', uploadedFile.filename))
            .pipe(csv())
            .on('headers', (headers) => {
                headerList = headers
            })
            .on('data', (data) => {
                results.push(Object.values(data))
            })
            .on('end', () => {
                res.render('home', {
                    headers: headerList,
                    results: results,
                    files: files,
                    filename: uploadedFile.name,
                })
            })
        } else {
            req.flash('error', 'File not found!')
            res.redirect('back')
        }
    }
}