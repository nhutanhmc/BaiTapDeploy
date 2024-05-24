const express = require('express');
const router = express.Router();
const imageController = require('../controller/imgController');
const upload = require("../config/uploadMiddleware");

router.post('/', upload.single('image'), imageController.uploadImage_Api);
router.get('/', imageController.getAllProduct_Api);
module.exports = router;
