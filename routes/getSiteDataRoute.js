const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.get("/data/:department/:division?", controller.getData);

module.exports = router;