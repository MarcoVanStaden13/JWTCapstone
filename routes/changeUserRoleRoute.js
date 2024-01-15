const express = require('express')
const router = express.Router();
const controller = require('../controllers/log.controller.js')

router.put("/changeUserRole/:userId", controller.changeUserRole);

module.exports = router;