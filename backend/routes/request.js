const express = require('express');
const router = express.Router();

// Controllers (to be implemented)
const requestController = require('../controllers/requestController');
const auth = require('../middlewares/auth'); // Add this line

router.post('/request', auth, requestController.sendRequest); // Protect sendRequest
router.get('/requests', auth, requestController.getRequests); // Protect getRequests
router.patch('/request/:id', auth, requestController.updateRequestStatus); // Protect updateRequestStatus
router.post('/entrepreneur-requests', auth, requestController.postEntrepreneurRequest);
router.get('/entrepreneur-requests', auth, requestController.getEntrepreneurRequests);
router.delete('/entrepreneur-requests/:id', auth, requestController.deleteEntrepreneurRequest);
router.get('/entrepreneur-analytics', auth, requestController.getEntrepreneurAnalytics);
router.get('/investor-analytics', auth, requestController.getInvestorAnalytics);

module.exports = router;