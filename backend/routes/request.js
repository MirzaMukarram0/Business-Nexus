const express = require('express');
const router = express.Router();

// Controllers (to be implemented)
const requestController = require('../controllers/requestController');
const auth = require('../middlewares/auth'); // Add this line

router.post('/request', auth, requestController.sendRequest); // Protect sendRequest
router.get('/requests', auth, requestController.getRequests); // Protect getRequests
router.patch('/request/:id', auth, requestController.updateRequestStatus); // Protect updateRequestStatus

module.exports = router;