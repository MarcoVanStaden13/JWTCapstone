const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.put("/assignUser/:userId", controller.assignUser);

module.exports = router;