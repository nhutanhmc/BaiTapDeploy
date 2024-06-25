const express = require('express');
const router = express.Router();
const storeController = require('../controller/storeController');
const { authenticateToken } = require('../config/authWithJWT');

router.use(authenticateToken);

router.route('/')
    .get(storeController.getAllStores)
    .post(storeController.createStore);

router.route('/:id')
    .get(storeController.getStoreById)
    .put(storeController.updateStore)
    .delete(storeController.deleteStore);

module.exports = router;
