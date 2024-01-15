const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.post("/register", controller.registerUser);

module.exports = router;