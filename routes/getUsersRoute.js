const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.get("/allUsers", controller.getUsers);

module.exports = router;