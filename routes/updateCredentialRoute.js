const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.put("/updateData/:department/:documentId", controller.updateCredentials);

module.exports = router;