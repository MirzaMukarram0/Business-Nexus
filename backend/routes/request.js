const express = require('express');
const router = express.Router();

// Controllers (to be implemented)
const requestController = require('../controllers/requestController');

router.post('/request', requestController.sendRequest);
router.get('/requests', requestController.getRequests);
router.patch('/request/:id', requestController.updateRequestStatus);

module.exports = router; 