const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Controllers (to be implemented)
const profileController = require('../controllers/profileController');

router.get('/profile/:id', profileController.getProfile);
router.patch('/profile/:id', auth, profileController.updateProfile);
router.get('/entrepreneurs', profileController.getEntrepreneurs);
router.get('/investors', profileController.getInvestors);

module.exports = router; 