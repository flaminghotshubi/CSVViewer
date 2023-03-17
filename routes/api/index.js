const express = require('express');
const router = express.Router();

const homeApi = require('../../controllers/api/home_api');
router.get('/', homeApi.home);
router.get('/view', homeApi.view);
router.post('/upload', homeApi.uploadFile);

module.exports = router