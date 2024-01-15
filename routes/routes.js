const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller.js');

router.get('/data/:department/:division?', logController.getData);
router.get('/allUsers', logController.getUsers);
router.put('/updateData/:department/:documentId', logController.updateCredentials);
router.post('/newData/:department/', logController.createCredential);
router.put('/unassignAssignUser/:userId', logController.assignUser);
router.put('/changeUserRole/:userId', logController.changeUserRole);
router.post('/login', logController.loginUsers);
router.post('/register', logController.registerUser);
router.get('/verify', logController.verifyToken);

module.exports = router;