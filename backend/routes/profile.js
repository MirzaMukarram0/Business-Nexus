const express = require('express');
const router = express.Router();

// Controllers (to be implemented)
const profileController = require('../controllers/profileController');

router.get('/profile/:id', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.get('/entrepreneurs', profileController.getEntrepreneurs);
router.get('/investors', profileController.getInvestors);

module.exports = router; 